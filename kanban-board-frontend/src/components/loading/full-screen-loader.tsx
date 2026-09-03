import { LoaderCircle } from "lucide-react";
export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoaderCircle className="size-7 animate-spin text-primary" />
    </div>
  );
}
