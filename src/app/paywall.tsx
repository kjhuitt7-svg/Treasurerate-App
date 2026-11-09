import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PurchasesPackage, PurchasesStoreProduct } from 'react-native-purchases';

import { Button, Card, SectionTitle } from '@/components/ui';
import { C, LINKS, R, S } from '@/constants/theme';
import { DAY_PASS_ID, FREE_DAILY_CREDITS, RENEWAL_NOTICE, STORE_NAME, creditsForProduct } from '@/lib/billing';
import { useWallet, type Catalog } from '@/lib/wallet';

const PLAN_COPY: Record<string, { name: string; per: string; note?: string }> = {
  WEEKLY: { name: 'Week', per: 'week' },
  MONTHLY: { name: 'Month', per: 'month', note: 'Most popular' },
  ANNUAL: { name: 'Year', per: 'year', note: 'Best value' },
};

export default function Paywall() {
  const { need } = useLocalSearchParams<{ need?: string }>();
  const w = useWallet();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    w.loadCatalog()
      .then(setCatalog)
      .catch(() => setFailed(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(id: string, fn: () => Promise<boolean>, done: string) {
    setBusy(id);
    try {
      if (await fn()) {
        Alert.alert('You are all set', done, [{ text: 'OK', onPress: () => router.back() }]);
      }
    } catch {
      Alert.alert('Purchase not completed', `${STORE_NAME.charAt(0).toUpperCase()}${STORE_NAME.slice(1)} could not finish the purchase. You were not charged. Please try again.`);
    } finally {
      setBusy(null);
    }
  }

  const buyPlan = (p: PurchasesPackage) => run(p.identifier, () => w.buyPlan(p), 'Every agent is unlocked. Enjoy the time back.');
  const buyOne = (p: PurchasesStoreProduct) =>
    run(
      p.identifier,
      () => w.buyOneTime(p),
      p.identifier === DAY_PASS_ID ? 'Every agent is unlocked for the next 24 hours.' : `${creditsForProduct(p.identifier)} credits added.`,
    );

  async function onRestore() {
    setBusy('restore');
    try {
      const ok = await w.restore();
      Alert.alert(ok ? 'Plan restored' : 'No active plan found', ok ? 'Every agent is unlocked.' : 'There is no active subscription on this Google account.');
    } catch {
      Alert.alert('Restore failed', 'Check your connection and try again.');
    } finally {
      setBusy(null);
    }
  }

  const dayPass = catalog?.oneTime.find((p) => p.identifier === DAY_PASS_ID);
  const packs = catalog?.oneTime.filter((p) => p.identifier !== DAY_PASS_ID) ?? [];

  return (
    <ScrollView contentContainerStyle={st.wrap}>
      <Stack.Screen options={{ title: 'Unlock every agent', presentation: 'modal' }} />

      <View style={{ gap: S.sm }}>
        <Text style={st.h1} accessibilityRole="header">
          Priced by the hours it saves
        </Text>
        <Text style={st.lead}>
          {need ? `This run needs ${need} credit${need === '1' ? '' : 's'}. ` : ''}
          You get {FREE_DAILY_CREDITS} free credits every day. Agents that save more time cost more credits per run (1–4). Any plan
          removes the meter.
        </Text>
        {!w.unlimited ? (
          <Text style={st.balance}>
            Today: {w.freeLeft} free · {w.credits} purchased credit{w.credits === 1 ? '' : 's'}
          </Text>
        ) : null}
      </View>

      {!catalog && !failed ? <ActivityIndicator color={C.gold} style={{ marginTop: S.xl }} /> : null}
      {failed ? (
        <Text style={st.err}>Couldn&apos;t load prices from {STORE_NAME}. Check your connection and reopen this screen.</Text>
      ) : null}

      {catalog?.plans.length ? (
        <View style={{ gap: S.sm }}>
          <SectionTitle>Plans · unlimited runs, every agent</SectionTitle>
          {catalog.plans.map((p) => {
            const c = PLAN_COPY[p.packageType] ?? { name: p.product.title, per: '' };
            return (
              <Option
                key={p.identifier}
                testID={`plan-${p.packageType}`}
                title={c.name}
                badge={c.note}
                price={`${p.product.priceString}${c.per ? ` / ${c.per}` : ''}`}
                busy={busy === p.identifier}
                disabled={Boolean(busy) || w.subscribed}
                onPress={() => buyPlan(p)}
              />
            );
          })}
          {w.subscribed ? <Text style={st.ok}>Your plan is active.</Text> : null}
        </View>
      ) : null}

      {dayPass ? (
        <View style={{ gap: S.sm }}>
          <SectionTitle>Just today</SectionTitle>
          <Option
            testID="day-pass"
            title="Day pass"
            sub="Every agent, unlimited, for 24 hours. Doesn't renew."
            price={dayPass.priceString}
            busy={busy === dayPass.identifier}
            disabled={Boolean(busy)}
            onPress={() => buyOne(dayPass)}
          />
        </View>
      ) : null}

      {packs.length ? (
        <View style={{ gap: S.sm }}>
          <SectionTitle>Credit packs · never expire</SectionTitle>
          {packs.map((p) => (
            <Option
              key={p.identifier}
              testID={`pack-${p.identifier}`}
              title={`${creditsForProduct(p.identifier)} credits`}
              sub="Pay as you go. Doesn't renew."
              price={p.priceString}
              busy={busy === p.identifier}
              disabled={Boolean(busy)}
              onPress={() => buyOne(p)}
            />
          ))}
        </View>
      ) : null}

      <Button label="Restore purchases" icon="refresh" variant="ghost" onPress={onRestore} loading={busy === 'restore'} disabled={Boolean(busy)} />

      <Text style={st.legal}>{RENEWAL_NOTICE}</Text>
      <View style={st.links}>
        <Text style={st.link} accessibilityRole="link" onPress={() => Linking.openURL(LINKS.terms)}>
          Terms
        </Text>
        <Text style={st.link} accessibilityRole="link" onPress={() => Linking.openURL(LINKS.privacy)}>
          Privacy Policy
        </Text>
      </View>
    </ScrollView>
  );
}

function Option(props: {
  title: string;
  sub?: string;
  badge?: string;
  price: string;
  busy?: boolean;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      testID={props.testID}
      accessibilityRole="button"
      accessibilityLabel={`${props.title}, ${props.price}${props.sub ? `. ${props.sub}` : ''}${props.badge ? `. ${props.badge}` : ''}`}
      accessibilityState={{ disabled: Boolean(props.disabled), busy: Boolean(props.busy) }}
      onPress={props.onPress}
      disabled={props.disabled}
      style={({ pressed }) => [pressed && { opacity: 0.8 }, props.disabled && !props.busy && { opacity: 0.5 }]}>
      <Card style={props.badge ? { ...st.opt, ...st.optHot } : st.opt}>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={st.row}>
            <Text style={st.optTitle}>{props.title}</Text>
            {props.badge ? <Text style={st.badge}>{props.badge}</Text> : null}
          </View>
          {props.sub ? <Text style={st.optSub}>{props.sub}</Text> : null}
        </View>
        {props.busy ? <ActivityIndicator color={C.gold} /> : <Text style={st.price}>{props.price}</Text>}
        <Ionicons name="chevron-forward" size={18} color={C.muted} />
      </Card>
    </Pressable>
  );
}

const st = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: S.lg, gap: S.xl, paddingBottom: S.xxl * 2 },
  h1: { color: C.gold, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  lead: { color: C.muted, fontSize: 14, lineHeight: 20 },
  balance: { color: C.text, fontSize: 13, fontWeight: '700' },
  err: { color: C.danger, fontSize: 14 },
  ok: { color: C.success, fontSize: 13, fontWeight: '700' },
  opt: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.md },
  optHot: { borderColor: C.gold, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  optTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  optSub: { color: C.muted, fontSize: 12 },
  badge: { color: C.bg, backgroundColor: C.gold, fontSize: 11, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 2, borderRadius: R.pill, overflow: 'hidden' },
  price: { color: C.gold, fontSize: 16, fontWeight: '800' },
  legal: { color: C.faint, fontSize: 11, lineHeight: 16 },
  links: { flexDirection: 'row', gap: S.xl, justifyContent: 'center' },
  link: { color: C.gold, fontWeight: '700', fontSize: 13 },
});
