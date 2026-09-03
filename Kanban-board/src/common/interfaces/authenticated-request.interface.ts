import { Request } from "express";
import { BoardRole } from "@prisma/client";
import { JwtPayload } from "../../auth/strategies/jwt.strategy";

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
  boardMembership?: {
    boardId: string;
    userId: string;
    role: BoardRole;
  };
}
