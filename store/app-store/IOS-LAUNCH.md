# iOS App Store launch checklist (Back Office 1.1.1)

Bundle ID `com.treasurerate.app` · App Store Connect app ID `6822269801` (from `eas.json`)

## Done in code (branch `fix/store-review-prep`)

- [x] Terms and Privacy open as in-app screens (no website nav, cart or pricing). Full text link inside each.
- [x] One-time AI data consent screen before the first agent run. Names TreasureRate and its AI providers (OpenAI, Anthropic).
- [x] "Delete all my data" also clears the consent, so it is asked again.
- [x] Back label fixed (was "(tabs)").
- [x] "Not legal advice" line on Contract Check and Policy Writer (the prompts already ended with it).
- [x] Restore Purchases message says Apple account on iPhone.
- [x] Camera and Photos permission text already set via the `expo-image-picker` plugin in `app.json`.
- [x] Dependency fix: Dependabot had moved `expo-router` to 58 on Expo SDK 57. Pinned back to `~57.0.31`, aligned the other Expo packages, `expo-doctor` 21/21, plain `npm ci` works.
- [x] 6.9" screenshots (1320x2868) in `screenshots-6.9in/` (plain) and `screenshots-6.9in-captioned/` (with headlines).

## Not changed on purpose

- Meeting Notes prompt (it can invent owners and dates from messy notes). Revisit before a wider push.

## You do in App Store Connect

1. **App Privacy labels.** Data collected, not linked to identity, not used for tracking: "User Content" (text sent to agents, app functionality) and "Purchases" (via RevenueCat). Add "Product Interaction" or "Diagnostics" only if you enable analytics. No sign-in, so no account data.
2. **Privacy Policy URL:** https://www.treasurerate.com/privacy
3. **Support URL:** https://www.treasurerate.com (or a support page) and support email support@treasurerate.com
4. **Age rating questionnaire.** Answer all questions (AI-generated text, no user-to-user content). The purchase sheet shows UNRATED until this is done.
5. **EULA/Terms link** in the app description: https://www.treasurerate.com/terms (or choose Apple's standard EULA).
6. **In-app purchases.** Create and submit each product with the same IDs as RevenueCat: subscription group with weekly, monthly and yearly; consumables for day pass and the three credit packs. Each needs a review screenshot of the paywall (see screenshots) and localized name and description. Attach them to this app version before submitting.
7. **RevenueCat.** Add the iOS app, paste the App Store Connect shared secret / API key, import products, attach the three subscriptions to entitlement `all_agents`, add them to offering `default`. Set `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (public `appl_` key) as an EAS production env var, otherwise billing is off on iOS.
8. **Screenshots.** Upload the 6.9" set. Apple scales it down for smaller iPhones. Add iPad screenshots only if `supportsTablet` becomes true (currently false).
9. **App name, subtitle, keywords, promo text, description.** Reuse the Play text in `store/google-play/en-US/`. No ratings, rankings or "best" claims. Keywords are a separate 100-character field on iOS.
10. **Category:** Business (secondary Productivity). **Price:** Free.
11. **Export compliance:** already answered in config (`ITSAppUsesNonExemptEncryption` false).
12. **Review information.** Paste the notes below. No login is needed.

## App Review notes (paste)

> Back Office needs no account or login. Open the app and tap any agent on the Agents tab. The first run shows a consent screen explaining that entered text is sent to our servers and third-party AI providers. Tap "I agree".
> "Sunny Side Up Cafe" and similar data in My Business is sample data we entered for testing. Results are AI generated and labeled as such, with a Report output button on every result.
> In-app purchases: Week, Month and Year auto-renewing plans (group "All agents"), a 24-hour Day Pass, and credit packs. Credits are consumable and stored on the device. Restore Purchases restores plans and active day passes; consumed credits are not restorable by design and this is stated in the purchase terms.
> Camera and Photos are used only to read text from documents on the device (on-device text recognition). Images are not uploaded.
> Contact: support@treasurerate.com

## Known risks and notes

- **Website footer.** The in-app legal screens avoid it, but the "Read the full text online" link still opens treasurerate.com/terms and /privacy, which show the full marketplace nav, cart and pricing. For the cleanest 3.1.1 position, add a chrome-free version of those two pages on the website (for example `?embed=1`) and point `LINKS.termsWeb` and `LINKS.privacyWeb` at it.
- **Credits are stored on the device.** Delete and reinstall loses purchased credits (documented in the fine print). Apple has accepted this for consumables, but mention it in review notes.
- **App name.** Home-screen label is "Back Office"; the store name should be "TreasureRate Back Office". Keep both consistent in metadata.
- **Hosting.** If AI output ever returns something offensive, Apple expects a way to report it. The Report output button covers this.
- **TestFlight sandbox.** Test one subscription purchase and Restore Purchases in TestFlight with a sandbox Apple ID before submitting.
