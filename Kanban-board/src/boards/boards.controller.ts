import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { JwtPayload } from "../auth/strategies/jwt.strategy";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import {
  BoardDetailsResponseDto,
  BoardResponseDto,
  DeleteBoardResponseDto,
} from "./dto/board-response.dto";
import { BoardsService } from "./boards.service";
import { BoardAccessGuard } from "../common/guards/board-access.guard";
import { BoardPermissionGuard } from "../common/guards/board-permission.guard";
import { BoardPermissions } from "../common/decorators/board-permissions.decorator";
import { BoardPermission } from "../common/enums/board-permission.enum";

@Controller("boards")
@ApiTags("Boards")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiOperation({ summary: "Create a board for the authenticated user" })
  @ApiBody({
    type: CreateBoardDto,
    examples: { default: { value: { name: "ERP Project" } } },
  })
  @ApiCreatedResponse({ type: BoardResponseDto })
  @ApiResponse({ status: 400, description: "Board name is invalid" })
  createBoard(@CurrentUser() user: JwtPayload, @Body() dto: CreateBoardDto) {
    return this.boardsService.createBoard(user.sub, dto);
  }

  @Get()
  @ApiOperation({
    summary: "Get boards where the authenticated user is a member",
  })
  @ApiOkResponse({ type: BoardResponseDto, isArray: true })
  getMyBoards(@CurrentUser() user: JwtPayload) {
    return this.boardsService.getUserBoards(user.sub);
  }

  @Get(":boardId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.VIEW_BOARD)
  @ApiOperation({ summary: "Get board details" })
  @ApiParam({
    name: "boardId",
    format: "uuid",
    example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a",
  })
  @ApiOkResponse({ type: BoardDetailsResponseDto })
  @ApiResponse({ status: 400, description: "Board ID must be a valid UUID" })
  @ApiResponse({ status: 403, description: "User is not a board member" })
  @ApiResponse({ status: 404, description: "Board not found" })
  getBoardDetails(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.boardsService.getBoardDetails(boardId, user.sub);
  }

  @Patch(":boardId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.UPDATE_BOARD)
  @ApiOperation({ summary: "Update a board (owner only)" })
  @ApiParam({ name: "boardId", format: "uuid" })
  @ApiBody({
    type: UpdateBoardDto,
    examples: { default: { value: { name: "Updated ERP Project" } } },
  })
  @ApiOkResponse({ type: BoardResponseDto })
  @ApiResponse({ status: 400, description: "Board ID or name is invalid" })
  @ApiResponse({
    status: 403,
    description: "Only the board owner can update the board",
  })
  @ApiResponse({ status: 404, description: "Board not found" })
  updateBoard(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.boardsService.updateBoard(boardId, user.sub, dto);
  }

  @Delete(":boardId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.DELETE_BOARD)
  @ApiOperation({ summary: "Delete a board (owner only)" })
  @ApiParam({ name: "boardId", format: "uuid" })
  @ApiOkResponse({ type: DeleteBoardResponseDto })
  @ApiResponse({
    status: 403,
    description: "Only the board owner can delete the board",
  })
  @ApiResponse({ status: 404, description: "Board not found" })
  deleteBoard(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.boardsService.deleteBoard(boardId, user.sub);
  }
}
