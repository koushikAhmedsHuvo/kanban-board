"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, KanbanSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

const links = [{ href: "/boards", label: "Boards" }];

function NavigationLinks() {
  return (
    <nav aria-label="Primary navigation" className="grid gap-2">
      {links.map((link) => (
        <Link
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppNav() {
  const router = useRouter();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r bg-muted/20 p-4 md:flex md:flex-col">
        <Link className="mb-6 flex items-center gap-2 font-semibold" href="/boards">
          <KanbanSquare className="size-5" />
          Kanban Board
        </Link>
        <NavigationLinks />
        <div className="mt-auto space-y-3 pt-6">
          {user?.email ? (
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          ) : null}
          <Button className="w-full" variant="outline" onClick={handleLogout}>
            <LogOut />
            Log out
          </Button>
        </div>
      </aside>
      <div className="flex items-center justify-between border-b px-4 py-3 md:hidden">
        <Link className="flex items-center gap-2 font-semibold" href="/boards">
          <KanbanSquare className="size-5" />
          Kanban Board
        </Link>
        <Sheet>
          <SheetTrigger render={<Button aria-label="Open navigation" size="icon" variant="outline" />}>
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader><SheetTitle>Navigation</SheetTitle></SheetHeader>
            <div className="grid gap-4 px-4">
              <NavigationLinks />
              <Button variant="outline" onClick={handleLogout}>
                <LogOut />
                Log out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
