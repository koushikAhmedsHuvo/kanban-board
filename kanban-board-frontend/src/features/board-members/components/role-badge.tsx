import { Badge } from "@/components/ui/badge";
import type { BoardRole } from "../types/member.types";
export function RoleBadge({ role }: { role: BoardRole }) { const styles = { OWNER: "border-red-200 bg-red-50 text-red-700", EDITOR: "border-blue-200 bg-blue-50 text-blue-700", VIEWER: "border-gray-200 bg-gray-100 text-gray-700" }; return <Badge variant="outline" className={styles[role]}>{role}</Badge>; }
