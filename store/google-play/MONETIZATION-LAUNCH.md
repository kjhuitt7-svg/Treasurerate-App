# Monetization launch checklist (v1.0.1)

The code ships **billing off**. It turns on only when `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` is set for the build. Until then, v1.0.1 behaves like 1.0.0: every agent free, no limits.

## How it works in the app

| Who | What they get |
| --- | --- |
| Everyone | 5 free credits per day (resets at midnight on the phone) |
| Credit cost per run | 1–4 credits, scaled to the minutes a run saves (`creditCost` in `src/lib/billing.ts`) |
| Week / Month / Year plan | Unlimited runs on every agent (RevenueCat entitlement `all_agents`) |
| Day pass | Unlimited runs for 24 hours, one-time |
| Credit packs | 60 / 130 / 350 credits, never expire, one-time |

Agent costs today: Reply Writer, Review Responder, Rewrite, Quote Follow-Up = 1 · Invoice & Estimate, Expense Log, Meeting Notes, Payment Reminder = 2 · Contract Check, Listing Writer, Resume Tailor, Policy Writer, Job Post Writer = 3 · Social Week, Content Factory = 4.

A failed or cancelled run refunds its credits. The paywall opens automatically when a run needs more credits than the user has, and from **Business → See plans & credits**.

## 1. Google Play Console (Monetize with Play → Products)

Payments profile must be verified under Driftwood Brands LLC first.

**Subscription** — product ID `treasurerate_plan`

| Base plan ID | Period | US price |
| --- | --- | --- |
| `weekly` | 1 week, auto-renewing | $4.99 |
| `monthly` | 1 month, auto-renewing | $12.99 |
| `yearly` | 1 year, auto-renewing | $99.00 |

**One-time products**

| Product ID | Price | Notes |
| --- | --- | --- |
| `day_pass` | $1.99 | Consumable |
| `credits_5` | $5.00 | Consumable, grants 60 |
| `credits_10` | $10.00 | Consumable, grants 130 |
| `credits_25` | $25.00 | Consumable, grants 350 |

IDs can never be changed or reused. Check the auto-converted Canada and UK prices and round any odd amounts.

## 2. RevenueCat

1. Create project **TreasureRate**, add a **Play Store** app with package `com.treasurerate.app`.
2. Upload the service account JSON (the `expo-play` key from Google Cloud project `treasurerate-app`). In Play Console → Users and permissions, give that account **View financial data** and **Manage orders and subscriptions**.
3. Import products. Create entitlement **`all_agents`** and attach the three subscription base plans to it. Do **not** attach `day_pass` or the credit packs; the app handles those itself.
4. Offering **`default`** (mark as Current) with packages: Weekly → `treasurerate_plan:weekly`, Monthly → `treasurerate_plan:monthly`, Annual → `treasurerate_plan:yearly`.
5. Copy the **public Google API key** (starts with `goog_`).

## 3. EAS

```bash
npx eas-cli@latest env:create --environment production --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value goog_XXXX --visibility plaintext
npx eas-cli@latest build -p android --profile production
```

The public SDK key is meant to ship inside the app; it is not a secret.

## 4. Test before production

1. Play Console → Settings → **License testing**: add your Gmail so test purchases are free.
2. Submit the build to the **Closed testing – Alpha** track (the default `eas submit` profile sends it to Internal as a draft).
3. On a tester phone: run agents until the free credits run out, buy a credit pack, buy a day pass, start a subscription, cancel it in Play, and use **Restore purchases** after reinstalling.
4. Promote to production when all of that works.

## 5. Store listing and policy updates (same release)

- **Full description** now has a "Free to start" pricing section (already in `en-US/full_description.txt`).
- **Data safety**: add *Financial info → Purchase history* (collected, not shared, for app functionality) and *App info and performance / Device or other IDs* (RevenueCat app user ID). Not used for ads.
- **Privacy policy** at treasurerate.com/privacy must mention that purchases are processed by Google Play and RevenueCat, and that the app stores an anonymous purchaser ID.
- **Terms** must cover auto-renewal and cancellation.

## Known limits (next steps)

- Free credits, day passes and credit packs live on the phone. Uninstalling or switching phones loses them. Subscriptions restore anywhere through Google Play. Fix: a server credit ledger keyed to the Clerk user, shared with treasurerate.com.
- Limits are enforced in the app; the `/api/agents/{num}/run` endpoint itself is still open. Fix: have the backend check a RevenueCat or Clerk token before running.
- Web purchases (Stripe on treasurerate.com) don't unlock the app until accounts are linked through Clerk.
