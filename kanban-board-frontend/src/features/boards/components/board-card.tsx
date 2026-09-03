"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Board } from "../types/board.types";

export function navigateToBoard(boardId: string, router: { push: (href: string) => void }) { router.push(`/boards/${boardId}`); }

export const BoardCard = React.memo(function BoardCard({ board }: { board: Board }) {
  const router = useRouter();
  return <Card role="button" tabIndex={0} className="cursor-pointer transition-colors hover:border-primary/60" onClick={() => navigateToBoard(board.id, router)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigateToBoard(board.id, router); }}>
    <CardHeader className="flex-row items-start justify-between gap-4"><div><CardTitle>{board.name}</CardTitle><p className="mt-1 text-sm text-muted-foreground">Owner: {board.owner.name}</p></div><ArrowUpRight className="size-5 text-muted-foreground" /></CardHeader>
    <CardContent className="flex items-center justify-between text-sm"><Badge variant={board.role === "OWNER" ? "default" : "secondary"}>{board.role}</Badge><span className="text-muted-foreground">Updated {new Date(board.updatedAt).toLocaleDateString()}</span></CardContent>
  </Card>;
});
