export type BoardRole = "OWNER" | "EDITOR" | "VIEWER";
export type ManageableRole = "EDITOR" | "VIEWER";
export interface BoardMember { id: string; role: BoardRole; user: { id: string; name: string; email: string }; createdAt?: string; }
export interface InviteMemberRequest { email: string; role: ManageableRole; }
export interface UpdateMemberRoleRequest { boardId: string; memberId: string; role: ManageableRole; }
