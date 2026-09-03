"use client";
import { PageError } from "@/components/error/page-error";
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PageError resetErrorBoundary={reset} />;
}
