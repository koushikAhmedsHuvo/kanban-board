import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
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
import { SearchUsersDto } from "./dto/search-users.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import {
  UserProfileResponseDto,
  UserSearchResultDto,
} from "./dto/user-response.dto";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Get the authenticated user profile" })
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiResponse({ status: 401, description: "Missing or invalid bearer token" })
  @ApiResponse({ status: 404, description: "User not found" })
  getCurrentUser(@CurrentUser() user: JwtPayload) {
    return this.usersService.getCurrentUser(user.sub);
  }

  @Get("search")
  @ApiOperation({ summary: "Search users by name or email" })
  @ApiQuery({
    name: "q",
    required: true,
    type: String,
    minLength: 1,
    example: "rahim",
  })
  @ApiOkResponse({ type: UserSearchResultDto, isArray: true })
  @ApiResponse({ status: 400, description: "Search query is invalid" })
  searchUsers(@Query() searchUsersDto: SearchUsersDto) {
    return this.usersService.searchUsers(searchUsersDto.q);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user profile by ID" })
  @ApiParam({
    name: "id",
    format: "uuid",
    example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a",
  })
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiResponse({ status: 400, description: "User ID must be a valid UUID" })
  @ApiResponse({ status: 404, description: "User not found" })
  getUserById(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch("me")
  @ApiOperation({ summary: "Update the authenticated user profile" })
  @ApiBody({
    type: UpdateProfileDto,
    examples: { default: { value: { name: "New Name" } } },
  })
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiResponse({ status: 400, description: "Profile data is invalid" })
  @ApiResponse({ status: 404, description: "User not found" })
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.sub, updateProfileDto);
  }
}
