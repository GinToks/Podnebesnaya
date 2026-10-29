import * as Sentry from "@sentry/nextjs";

export function reportError(error: unknown, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error, context);
  }
  Sentry.captureException(error, context ? { extra: context } : undefined);
}
