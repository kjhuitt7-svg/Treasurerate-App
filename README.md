# TreasureRate Power Pack (Android)

Ten AI agents for solo business owners, freelancers and side hustlers, built on the TreasureRate agent backend.

- Expo SDK 57, Expo Router
- No sign-in in v1: business profile and run history are stored on the device only
- Agents call `POST https://www.treasurerate.com/api/agents/{num}/run` (override with `EXPO_PUBLIC_API_BASE`)
- No Gmail, Calendar, Drive, or bank access, so no restricted-scope review

## Run locally

```bash
npm install
npx expo start
```

## Build

```bash
npx eas-cli@latest init          # first time only, links the Expo project
npx eas-cli@latest build -p android --profile preview      # installable APK for testing
npx eas-cli@latest build -p android --profile production   # AAB for Google Play
```

Agent definitions live in `src/lib/agents.ts`.
