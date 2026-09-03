"use client";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { PageError } from "./page-error";
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={PageError}>
      {children}
    </ReactErrorBoundary>
  );
}
