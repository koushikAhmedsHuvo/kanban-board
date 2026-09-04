"use client";

import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function BoardSidebar() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <Settings /> Board settings
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Board workspace</SheetTitle>
        </SheetHeader>
        <div className="space-y-8 p-4">
          <section>
            <h2 className="flex items-center gap-2 font-semibold">
              <Settings className="size-4" />
              Settings
            </h2>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
