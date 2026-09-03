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
import { CreateColumnDto } from "./dto/create-column.dto";
import { MoveColumnDto } from "./dto/move-column.dto";
import { UpdateColumnDto } from "./dto/update-column.dto";
import {
  ColumnDetailsResponseDto,
  ColumnResponseDto,
  DeleteColumnResponseDto,
  MoveColumnResponseDto,
} from "./dto/column-response.dto";
import { ColumnsService } from "./columns.service";
import { BoardAccessGuard } from "../common/guards/board-access.guard";
import { BoardPermissionGuard } from "../common/guards/board-permission.guard";
import { BoardPermissions } from "../common/decorators/board-permissions.decorator";
import { BoardPermission } from "../common/enums/board-permission.enum";

@Controller()
@ApiTags("Columns")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post("boards/:boardId/columns")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.CREATE_COLUMN)
  @ApiOperation({ summary: "Create a column (owner or editor)" })
  @ApiParam({ name: "boardId", format: "uuid" })
  @ApiBody({
    type: CreateColumnDto,
    examples: { default: { value: { title: "Todo" } } },
  })
  @ApiCreatedResponse({ type: ColumnResponseDto })
  @ApiResponse({
    status: 400,
    description: "Board ID or column title is invalid",
  })
  @ApiResponse({
    status: 403,
    description: "Only board owners and editors can create columns",
  })
  @ApiResponse({ status: 404, description: "Board not found" })
  createColumn(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateColumnDto,
  ) {
    return this.columnsService.createColumn(boardId, user.sub, dto);
  }

  @Get("boards/:boardId/columns")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.VIEW_BOARD)
  @ApiOperation({ summary: "Get board columns ordered by position" })
  @ApiParam({ name: "boardId", format: "uuid" })
  @ApiOkResponse({ type: ColumnResponseDto, isArray: true })
  @ApiResponse({ status: 403, description: "User is not a board member" })
  @ApiResponse({ status: 404, description: "Board not found" })
  getBoardColumns(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.columnsService.getBoardColumns(boardId, user.sub);
  }

  @Get("columns/:columnId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.VIEW_BOARD)
  @ApiOperation({ summary: "Get column details" })
  @ApiParam({ name: "columnId", format: "uuid" })
  @ApiOkResponse({ type: ColumnDetailsResponseDto })
  @ApiResponse({ status: 403, description: "User is not a board member" })
  @ApiResponse({ status: 404, description: "Column or board not found" })
  getColumnById(
    @Param("columnId", new ParseUUIDPipe()) columnId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.columnsService.getColumnById(columnId, user.sub);
  }

  @Patch("columns/:columnId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.UPDATE_COLUMN)
  @ApiOperation({ summary: "Update a column (owner or editor)" })
  @ApiParam({ name: "columnId", format: "uuid" })
  @ApiBody({
    type: UpdateColumnDto,
    examples: { default: { value: { title: "Backlog" } } },
  })
  @ApiOkResponse({ type: ColumnResponseDto })
  @ApiResponse({
    status: 403,
    description: "Only board owners and editors can update columns",
  })
  @ApiResponse({ status: 404, description: "Column or board not found" })
  updateColumn(
    @Param("columnId", new ParseUUIDPipe()) columnId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateColumnDto,
  ) {
    return this.columnsService.updateColumn(columnId, user.sub, dto);
  }

  @Delete("columns/:columnId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.DELETE_COLUMN)
  @ApiOperation({ summary: "Delete an empty column (owner or editor)" })
  @ApiParam({ name: "columnId", format: "uuid" })
  @ApiOkResponse({ type: DeleteColumnResponseDto })
  @ApiResponse({
    status: 403,
    description: "Only board owners and editors can delete columns",
  })
  @ApiResponse({ status: 404, description: "Column or board not found" })
  @ApiResponse({
    status: 409,
    description: "Column contains tasks and cannot be deleted",
  })
  deleteColumn(
    @Param("columnId", new ParseUUIDPipe()) columnId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.columnsService.deleteColumn(columnId, user.sub);
  }

  @Post("columns/:columnId/move")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.MOVE_COLUMN)
  @ApiOperation({ summary: "Move a column (owner or editor)" })
  @ApiParam({ name: "columnId", format: "uuid" })
  @ApiBody({
    type: MoveColumnDto,
    examples: { default: { value: { targetPosition: 1500 } } },
  })
  @ApiOkResponse({ type: MoveColumnResponseDto })
  @ApiResponse({
    status: 403,
    description: "Only board owners and editors can move columns",
  })
  @ApiResponse({ status: 404, description: "Column or board not found" })
  moveColumn(
    @Param("columnId", new ParseUUIDPipe()) columnId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: MoveColumnDto,
  ) {
    return this.columnsService.moveColumn(columnId, user.sub, dto);
  }
}
