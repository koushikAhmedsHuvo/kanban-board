"use client";

import { Activity, Bell, Settings, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ActiveMembers } from "@/features/presence/active-members";
import { ActivityTimeline } from "@/features/activity/activity-timeline";
import { NotificationCenter } from "@/features/notifications/notification-center";

export function BoardSidebar({ boardId }: { boardId: string }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <Activity /> Board activity
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Board workspace</SheetTitle>
        </SheetHeader>
        <div className="space-y-8 p-4">
          <section>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Users className="size-4" />
              Members
            </h2>
            <ActiveMembers boardId={boardId} />
          </section>
          <section>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Activity className="size-4" />
              Activity
            </h2>
            <ActivityTimeline boardId={boardId} />
          </section>
          <section>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Bell className="size-4" />
              Notifications
            </h2>
            <NotificationCenter boardId={boardId} />
          </section>
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
