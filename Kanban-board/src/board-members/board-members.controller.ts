import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { JwtPayload } from "../auth/strategies/jwt.strategy";
import { AddMemberDto } from "./dto/add-member.dto";
import {
  BoardMemberResponseDto,
  DeleteMemberResponseDto,
  AvailableUserResponseDto,
} from "./dto/board-member-response.dto";
import { SearchAvailableUsersDto } from "./dto/search-available-users.dto";
import { UpdateMemberRoleDto } from "./dto/update-member-role.dto";
import { BoardMembersService } from "./board-members.service";
import { BoardAccessGuard } from "../common/guards/board-access.guard";
import { BoardPermissionGuard } from "../common/guards/board-permission.guard";
import { BoardPermissions } from "../common/decorators/board-permissions.decorator";
import { BoardPermission } from "../common/enums/board-permission.enum";

@Controller("boards/:boardId")
@ApiTags("Board Members")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BoardMembersController {
  constructor(private readonly boardMembersService: BoardMembersService) {}

  @Post("members")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.MANAGE_MEMBERS)
  @ApiOperation({ summary: "Add a member to a board (owner only)" })
  @ApiParam({ name: "boardId", format: "uuid" })
  @ApiBody({
    type: AddMemberDto,
    examples: {
      default: {
        value: {
          userId: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a",
          role: "EDITOR",
        },
      },
    },
  })
  @ApiCreatedResponse({ type: BoardMemberResponseDto })
  @ApiResponse({
    status: 403,
    description: "Only the board owner can add members",
  })
  @ApiResponse({ status: 404, description: "Board or user not found" })
  @ApiResponse({ status: 409, description: "User is already a member" })
  addMember(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: AddMemberDto,
  ) {
    return this.boardMembersService.addMember(boardId, user.sub, dto);
  }

  @Get("members")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.VIEW_BOARD)
  @ApiOperation({ summary: "Get board members" })
  @ApiParam({ name: "boardId", format: "uuid" })
  @ApiOkResponse({ type: BoardMemberResponseDto, isArray: true })
  @ApiResponse({ status: 403, description: "User is not a board member" })
  @ApiResponse({ status: 404, description: "Board not found" })
  getMembers(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.boardMembersService.getBoardMembers(boardId, user.sub);
  }

  @Get("available-users")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.VIEW_BOARD)
  @ApiOperation({ summary: "Search users available to add to a board" })
  @ApiParam({ name: "boardId", format: "uuid" })
  @ApiQuery({
    name: "q",
    required: true,
    type: String,
    minLength: 1,
    example: "rahim",
  })
  @ApiOkResponse({ type: AvailableUserResponseDto, isArray: true })
  @ApiResponse({ status: 403, description: "User is not a board member" })
  searchAvailableUsers(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @CurrentUser() user: JwtPayload,
    @Query() dto: SearchAvailableUsersDto,
  ) {
    return this.boardMembersService.searchAvailableUsers(
      boardId,
      user.sub,
      dto,
    );
  }

  @Patch("members/:memberId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.MANAGE_MEMBERS)
  @ApiOperation({ summary: "Update a member role (owner only)" })
  @ApiParam({ name: "boardId", format: "uuid" })
  @ApiParam({ name: "memberId", format: "uuid" })
  @ApiBody({
    type: UpdateMemberRoleDto,
    examples: { default: { value: { role: "VIEWER" } } },
  })
  @ApiOkResponse({ type: BoardMemberResponseDto })
  @ApiResponse({
    status: 403,
    description:
      "Only the owner can update roles or the owner role cannot be modified",
  })
  @ApiResponse({ status: 404, description: "Board or membership not found" })
  updateRole(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @Param("memberId", new ParseUUIDPipe()) memberId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.boardMembersService.updateMemberRole(
      boardId,
      memberId,
      user.sub,
      dto,
    );
  }

  @Delete("members/:memberId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.MANAGE_MEMBERS)
  @ApiOperation({ summary: "Remove a member (owner only)" })
  @ApiParam({ name: "boardId", format: "uuid" })
  @ApiParam({ name: "memberId", format: "uuid" })
  @ApiOkResponse({ type: DeleteMemberResponseDto })
  @ApiResponse({
    status: 403,
    description:
      "Only the owner can remove members or the owner cannot be removed",
  })
  @ApiResponse({ status: 404, description: "Board or membership not found" })
  removeMember(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @Param("memberId", new ParseUUIDPipe()) memberId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.boardMembersService.removeMember(boardId, memberId, user.sub);
  }
}
