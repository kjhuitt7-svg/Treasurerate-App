import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Purchases, {
  LOG_LEVEL,
  PRODUCT_CATEGORY,
  type CustomerInfo,
  type MakePurchaseResult,
  type PurchasesPackage,
  type PurchasesStoreProduct,
} from 'react-native-purchases';

import {
  BILLING_ENABLED,
  DAY_PASS_ID,
  DAY_PASS_MS,
  ENTITLEMENT,
  FREE_DAILY_CREDITS,
  ONE_TIME_IDS,
  RC_KEY,
  creditsForProduct,
} from './billing';

/**
 * Credits, day passes and subscription status.
 *
 * Subscriptions are verified by Google Play through RevenueCat and restore on any device.
 * Credits and the day pass are consumables tracked on this device. Moving them to a server
 * ledger (shared with treasurerate.com through the Clerk login) is the next step.
 */

type Saved = {
  credits: number; // purchased credits, never expire
  dayPassUntil: number; // epoch ms
  freeDate: string; // YYYY-MM-DD the free allowance applies to
  freeUsed: number;
  seenTx: string[]; // transactions already credited, so a retry never double-grants
};

const K_WALLET = 'tr.wallet.v1';
const EMPTY: Saved = { credits: 0, dayPassUntil: 0, freeDate: '', freeUsed: 0, seenTx: [] };

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export type Charge = { free: number; paid: number };
export type Catalog = { plans: PurchasesPackage[]; oneTime: PurchasesStoreProduct[] };

type Ctx = {
  enabled: boolean;
  ready: boolean;
  subscribed: boolean;
  dayPassUntil: number;
  dayPassActive: boolean;
  unlimited: boolean;
  freeLeft: number;
  credits: number;
  /** Takes credits for a run. Returns null if there aren't enough. */
  charge: (cost: number) => Promise<Charge | null>;
  refund: (c: Charge) => Promise<void>;
  loadCatalog: () => Promise<Catalog>;
  buyPlan: (p: PurchasesPackage) => Promise<boolean>;
  buyOneTime: (p: PurchasesStoreProduct) => Promise<boolean>;
  restore: () => Promise<boolean>;
  managementURL: string | null;
};

const WalletCtx = createContext<Ctx | null>(null);

export function isCancelled(e: unknown) {
  const err = e as { userCancelled?: boolean | null; code?: string };
  return Boolean(err?.userCancelled) || err?.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!BILLING_ENABLED);
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [info, setInfo] = useState<CustomerInfo | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const ref = useRef(saved);

  const persist = useCallback(async (next: Saved) => {
    ref.current = next;
    setSaved(next);
    try {
      await AsyncStorage.setItem(K_WALLET, JSON.stringify(next));
    } catch {
      // Storage full or unavailable: keep the in-memory balance for this session.
    }
  }, []);

  useEffect(() => {
    if (!BILLING_ENABLED) return;
    const onInfo = (ci: CustomerInfo) => setInfo(ci);
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(K_WALLET);
        if (raw) {
          const s = { ...EMPTY, ...JSON.parse(raw) } as Saved;
          ref.current = s;
          setSaved(s);
        }
      } catch {
        // Start from an empty wallet.
      }
      try {
        Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
        Purchases.configure({ apiKey: RC_KEY! });
        Purchases.addCustomerInfoUpdateListener(onInfo);
        setInfo(await Purchases.getCustomerInfo());
      } catch {
        // Offline or Play unavailable: free allowance and saved credits still work.
      } finally {
        setReady(true);
      }
    })();
    // Re-check day-pass expiry once a minute.
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      clearInterval(t);
      try {
        Purchases.removeCustomerInfoUpdateListener(onInfo);
      } catch {}
    };
  }, []);

  const subscribed = Boolean(info?.entitlements.active[ENTITLEMENT]);
  const dayPass = saved.dayPassUntil > now;
  const unlimited = !BILLING_ENABLED || subscribed || dayPass;
  const freeLeft = saved.freeDate === today() ? Math.max(0, FREE_DAILY_CREDITS - saved.freeUsed) : FREE_DAILY_CREDITS;

  const charge = useCallback(
    async (cost: number): Promise<Charge | null> => {
      if (unlimited) return { free: 0, paid: 0 };
      const s = ref.current;
      const d = today();
      const used = s.freeDate === d ? s.freeUsed : 0;
      const fromFree = Math.min(cost, Math.max(0, FREE_DAILY_CREDITS - used));
      const fromPaid = cost - fromFree;
      if (fromPaid > s.credits) return null;
      await persist({ ...s, freeDate: d, freeUsed: used + fromFree, credits: s.credits - fromPaid });
      return { free: fromFree, paid: fromPaid };
    },
    [unlimited, persist],
  );

  const refund = useCallback(
    async (c: Charge) => {
      if (!c.free && !c.paid) return;
      const s = ref.current;
      const freeUsed = s.freeDate === today() ? Math.max(0, s.freeUsed - c.free) : s.freeUsed;
      await persist({ ...s, freeUsed, credits: s.credits + c.paid });
    },
    [persist],
  );

  const grant = useCallback(
    async (r: MakePurchaseResult) => {
      setInfo(r.customerInfo);
      const tx = r.transaction?.transactionIdentifier;
      const s = ref.current;
      if (tx && s.seenTx.includes(tx)) return;
      const seenTx = tx ? [tx, ...s.seenTx].slice(0, 200) : s.seenTx;
      if (r.productIdentifier === DAY_PASS_ID) {
        const from = Math.max(Date.now(), s.dayPassUntil);
        await persist({ ...s, seenTx, dayPassUntil: from + DAY_PASS_MS });
        setNow(Date.now());
      } else {
        await persist({ ...s, seenTx, credits: s.credits + creditsForProduct(r.productIdentifier) });
      }
    },
    [persist],
  );

  const loadCatalog = useCallback(async (): Promise<Catalog> => {
    if (!BILLING_ENABLED) return { plans: [], oneTime: [] };
    const [offerings, products] = await Promise.all([
      Purchases.getOfferings(),
      Purchases.getProducts(ONE_TIME_IDS, PRODUCT_CATEGORY.NON_SUBSCRIPTION),
    ]);
    const order = ['WEEKLY', 'MONTHLY', 'ANNUAL'];
    const plans = (offerings.current?.availablePackages ?? [])
      .filter((p) => order.includes(p.packageType))
      .sort((a, b) => order.indexOf(a.packageType) - order.indexOf(b.packageType));
    const oneTime = ONE_TIME_IDS.map((id) => products.find((p) => p.identifier === id)).filter(
      (p): p is PurchasesStoreProduct => Boolean(p),
    );
    return { plans, oneTime };
  }, []);

  const buyPlan = useCallback(async (p: PurchasesPackage) => {
    try {
      const r = await Purchases.purchasePackage(p);
      setInfo(r.customerInfo);
      return Boolean(r.customerInfo.entitlements.active[ENTITLEMENT]);
    } catch (e) {
      if (isCancelled(e)) return false;
      throw e;
    }
  }, []);

  const buyOneTime = useCallback(
    async (p: PurchasesStoreProduct) => {
      try {
        await grant(await Purchases.purchaseStoreProduct(p));
        return true;
      } catch (e) {
        if (isCancelled(e)) return false;
        throw e;
      }
    },
    [grant],
  );

  const restore = useCallback(async () => {
    const ci = await Purchases.restorePurchases();
    setInfo(ci);
    return Boolean(ci.entitlements.active[ENTITLEMENT]);
  }, []);

  return (
    <WalletCtx.Provider
      value={{
        enabled: BILLING_ENABLED,
        ready,
        subscribed,
        dayPassUntil: saved.dayPassUntil,
        dayPassActive: dayPass,
        unlimited,
        freeLeft,
        credits: saved.credits,
        charge,
        refund,
        loadCatalog,
        buyPlan,
        buyOneTime,
        restore,
        managementURL: info?.managementURL ?? null,
      }}>
      {children}
    </WalletCtx.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider');
  return ctx;
}
