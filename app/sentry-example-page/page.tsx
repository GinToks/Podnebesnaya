"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Sentry Test</h1>
      <button
        className="px-4 py-2 rounded bg-red-600 text-white"
        onClick={() => {
          throw new Error("Sentry test error from client");
        }}
      >
        Throw client error
      </button>
      <button
        className="px-4 py-2 rounded bg-red-800 text-white"
        onClick={async () => {
          await fetch("/api/sentry-test");
        }}
      >
        Trigger server error
      </button>
    </main>
  );
}
