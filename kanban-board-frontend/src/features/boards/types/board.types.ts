export type BoardRole = "OWNER" | "EDITOR" | "VIEWER";

export interface BoardOwner { id: string; name: string; }
export interface Board { id: string; name: string; role: BoardRole; owner: BoardOwner; createdAt: string; updatedAt: string; }
export interface BoardDetails extends Board { memberCount: number; columnCount: number; }
export interface CreateBoardRequest { name: string; }
export interface UpdateBoardRequest { name: string; }
export interface DeleteBoardResponse { message: string; }
