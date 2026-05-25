export function initWebSentry(): void {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || typeof window === "undefined") return;
  void (
    // @ts-expect-error @sentry/nextjs is an optional dependency
    import("@sentry/nextjs") as Promise<{ init: (options: object) => void }>
  ).then((Sentry) => {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    });
  });
}
