import { Platform } from 'react-native';

import type { Agent } from './agents';

/**
 * Monetization config. Prices live in Google Play Console (and RevenueCat), not here.
 *
 * Play Console products (IDs are permanent, copy exactly):
 *   Subscription  treasurerate_plan   base plans: weekly $4.99, monthly $12.99, yearly $99
 *   One-time      day_pass            $1.99  → every agent for 24 hours
 *   One-time      credits_5           $5     → 60 credits
 *   One-time      credits_10          $10    → 130 credits
 *   One-time      credits_25          $25    → 350 credits
 *
 * RevenueCat: entitlement `all_agents` attached to the three base plans.
 * Current offering packages: $rc_weekly, $rc_monthly, $rc_annual.
 */

/** RevenueCat public SDK key (safe to ship in the app). Billing stays off until it is set. */
export const RC_KEY = Platform.select({
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  default: undefined,
});

/** With no key (or on web) the app behaves exactly like v1.0.0: every agent free, no limits. */
export const BILLING_ENABLED = Boolean(RC_KEY) && Platform.OS !== 'web';

export const ENTITLEMENT = 'all_agents';

/** Free credits granted every calendar day, on this device. Enough for one heavy run or a few light ones. */
export const FREE_DAILY_CREDITS = 5;

export const DAY_PASS_ID = 'day_pass';
export const DAY_PASS_MS = 24 * 60 * 60 * 1000;

export const CREDIT_PACKS: { id: string; credits: number }[] = [
  { id: 'credits_5', credits: 60 },
  { id: 'credits_10', credits: 130 },
  { id: 'credits_25', credits: 350 },
];

export const ONE_TIME_IDS = [DAY_PASS_ID, ...CREDIT_PACKS.map((p) => p.id)];

export function creditsForProduct(productId: string) {
  return CREDIT_PACKS.find((p) => p.id === productId)?.credits ?? 0;
}

/**
 * "Priced by the hours it saves": an agent's cost per run scales with the time one run saves.
 * Same four tiers as the website (1–4 credits).
 */
export function creditCost(agent: Pick<Agent, 'minutesSaved'>) {
  const m = agent.minutesSaved;
  if (m < 15) return 1;
  if (m < 30) return 2;
  if (m < 45) return 3;
  return 4;
}

export const MANAGE_SUBSCRIPTIONS_URL = Platform.select({
  android: 'https://play.google.com/store/account/subscriptions?package=com.treasurerate.app',
  default: 'https://apps.apple.com/account/subscriptions',
});
