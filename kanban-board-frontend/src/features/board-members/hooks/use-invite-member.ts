"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { inviteMember } from "../api/invite-member";
import { MEMBER_KEYS } from "./use-members";
export function useInviteMember(boardId: string) { const client = useQueryClient(); return useMutation({ mutationFn: (data: Parameters<typeof inviteMember>[1]) => inviteMember(boardId, data), onSuccess: () => { client.invalidateQueries({ queryKey: MEMBER_KEYS.board(boardId) }); toast.success("Member invited"); }, onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to invite member") }); }
