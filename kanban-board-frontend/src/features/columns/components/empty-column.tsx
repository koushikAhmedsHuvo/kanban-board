import { NoColumns } from "@/components/empty/no-columns";
export function EmptyColumn({
  canManage,
  action,
}: {
  canManage: boolean;
  action?: React.ReactNode;
}) {
  return <NoColumns action={canManage ? action : undefined} />;
}
