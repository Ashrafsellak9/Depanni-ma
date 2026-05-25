export function initMobileSentry(): void {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  void import("@sentry/react-native").then((Sentry) => {
    Sentry.init({ dsn, tracesSampleRate: 0.1 });
  });
}
