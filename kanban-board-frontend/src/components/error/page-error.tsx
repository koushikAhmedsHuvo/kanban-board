"use client";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
export function PageError({
  resetErrorBoundary,
}: {
  resetErrorBoundary?: () => void;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold">Something went wrong.</h2>
      <Button variant="outline" onClick={resetErrorBoundary}>
        <RefreshCw />
        Retry
      </Button>
    </div>
  );
}
