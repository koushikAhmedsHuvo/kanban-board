import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotFound({ message = "The requested resource was not found." }: { message?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold">Not Found</h2>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Link className={cn(buttonVariants({ variant: "outline" }))} href="/boards">
        <ArrowLeft />
        Back to boards
      </Link>
    </div>
  );
}
