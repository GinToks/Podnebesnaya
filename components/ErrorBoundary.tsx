"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import type { ReactNode } from "react";
import type { FallbackProps } from "react-error-boundary";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function Fallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 p-8">
      <p className="text-ink-muted text-lg">Что-то пошло не так</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 rounded-lg bg-sage text-white hover:bg-sage-dark transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  );
}

export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : Fallback}
      onError={(error, info) => console.error("ErrorBoundary caught:", error, info)}
    >
      {children}
    </ReactErrorBoundary>
  );
}
