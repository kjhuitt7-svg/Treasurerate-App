import PostHog from 'posthog-react-native';

// PostHog project key and host come from EAS environment variables, so
// analytics stays off in any build where they are not set.
const key = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

export const posthog: PostHog | null = key
  ? new PostHog(key, {
      host,
      // App opened / backgrounded / installed / updated events.
      captureAppLifecycleEvents: true,
      // The app has no accounts, so events stay anonymous.
      personProfiles: 'identified_only',
    })
  : null;

/** Record a screen view. Only the route path is sent, never its params. */
export function trackScreen(pathname: string) {
  posthog?.screen(pathname);
}
