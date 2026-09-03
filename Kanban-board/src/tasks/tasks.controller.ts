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
import { CreateTaskDto } from "./dto/create-task.dto";
import { MoveTaskDto } from "./dto/move-task.dto";
import {
  TaskActionResponseDto,
  TaskDetailsResponseDto,
  TaskResponseDto,
  DeleteTaskResponseDto,
} from "./dto/task-response.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TasksService } from "./tasks.service";
import { BoardAccessGuard } from "../common/guards/board-access.guard";
import { BoardPermissionGuard } from "../common/guards/board-permission.guard";
import { BoardPermissions } from "../common/decorators/board-permissions.decorator";
import { BoardPermission } from "../common/enums/board-permission.enum";

@Controller()
@ApiTags("Tasks")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post("columns/:columnId/tasks")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.CREATE_TASK)
  @ApiOperation({ summary: "Create a task (owner or editor)" })
  @ApiParam({ name: "columnId", format: "uuid" })
  @ApiBody({
    type: CreateTaskDto,
    examples: {
      default: {
        value: {
          title: "Implement JWT Authentication",
          description: "Create login and registration APIs",
        },
      },
    },
  })
  @ApiCreatedResponse({ type: TaskResponseDto })
  @ApiResponse({
    status: 403,
    description: "Only board owners and editors can create tasks",
  })
  @ApiResponse({ status: 404, description: "Column or board not found" })
  createTask(
    @Param("columnId", new ParseUUIDPipe()) columnId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(columnId, user.sub, dto);
  }

  @Get("columns/:columnId/tasks")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.VIEW_BOARD)
  @ApiOperation({ summary: "Get tasks in a column ordered by position" })
  @ApiParam({ name: "columnId", format: "uuid" })
  @ApiOkResponse({ type: TaskResponseDto, isArray: true })
  @ApiResponse({ status: 403, description: "User is not a board member" })
  @ApiResponse({ status: 404, description: "Column or board not found" })
  getColumnTasks(
    @Param("columnId", new ParseUUIDPipe()) columnId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.getColumnTasks(columnId, user.sub);
  }

  @Get("tasks/:taskId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.VIEW_BOARD)
  @ApiOperation({ summary: "Get task details" })
  @ApiParam({ name: "taskId", format: "uuid" })
  @ApiOkResponse({ type: TaskDetailsResponseDto })
  @ApiResponse({ status: 403, description: "User is not a board member" })
  @ApiResponse({ status: 404, description: "Task or board not found" })
  getTaskById(
    @Param("taskId", new ParseUUIDPipe()) taskId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.getTaskById(taskId, user.sub);
  }

  @Patch("tasks/:taskId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.UPDATE_TASK)
  @ApiOperation({ summary: "Update a task (owner or editor)" })
  @ApiParam({ name: "taskId", format: "uuid" })
  @ApiBody({
    type: UpdateTaskDto,
    examples: {
      default: {
        value: { title: "Updated Task", description: "Updated Description" },
      },
    },
  })
  @ApiOkResponse({ type: TaskResponseDto })
  @ApiResponse({
    status: 400,
    description: "At least one task field is required",
  })
  @ApiResponse({
    status: 403,
    description: "Only board owners and editors can update tasks",
  })
  @ApiResponse({ status: 404, description: "Task or board not found" })
  updateTask(
    @Param("taskId", new ParseUUIDPipe()) taskId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(taskId, user.sub, dto);
  }

  @Delete("tasks/:taskId")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.DELETE_TASK)
  @ApiOperation({ summary: "Delete a task (owner or editor)" })
  @ApiParam({ name: "taskId", format: "uuid" })
  @ApiOkResponse({ type: DeleteTaskResponseDto })
  @ApiResponse({
    status: 403,
    description: "Only board owners and editors can delete tasks",
  })
  @ApiResponse({ status: 404, description: "Task or board not found" })
  deleteTask(
    @Param("taskId", new ParseUUIDPipe()) taskId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.deleteTask(taskId, user.sub);
  }

  @Post("tasks/:taskId/move")
  @UseGuards(BoardAccessGuard, BoardPermissionGuard)
  @BoardPermissions(BoardPermission.MOVE_TASK)
  @ApiOperation({ summary: "Move a task within or between columns" })
  @ApiParam({ name: "taskId", format: "uuid" })
  @ApiBody({
    type: MoveTaskDto,
    examples: {
      default: {
        value: {
          targetColumnId: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a",
          targetIndex: 1,
        },
      },
    },
  })
  @ApiOkResponse({ type: TaskActionResponseDto })
  @ApiResponse({
    status: 403,
    description: "Only board owners and editors can move tasks",
  })
  @ApiResponse({ status: 404, description: "Task or target column not found" })
  moveTask(
    @Param("taskId", new ParseUUIDPipe()) taskId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: MoveTaskDto,
  ) {
    return this.tasksService.moveTask(
      taskId,
      dto.targetColumnId,
      dto.targetIndex,
      user.sub,
    );
  }
}
