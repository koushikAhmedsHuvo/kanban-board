"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function HomeCta() {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link className={cn(buttonVariants())} href="/boards">
          Go to boards
          <ArrowRight />
        </Link>
        <Button
          variant="outline"
          onClick={() => {
            logout();
          }}
        >
          Log out
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <Link className={cn(buttonVariants())} href="/login">
        Sign in
        <ArrowRight />
      </Link>
      <Link
        className={cn(buttonVariants({ variant: "outline" }))}
        href="/register"
      >
        Create account
      </Link>
    </div>
  );
}
