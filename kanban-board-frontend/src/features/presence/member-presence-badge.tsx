import { cn } from "@/lib/utils";

export function MemberPresenceBadge({
  online,
  name,
}: {
  online: boolean;
  name?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className={cn(
          "size-2 rounded-full",
          online ? "bg-emerald-500" : "bg-muted-foreground/40",
        )}
      />
      {name
        ? `${name} is ${online ? "online" : "offline"}`
        : online
          ? "Online"
          : "Offline"}
    </span>
  );
}
