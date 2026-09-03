import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from './strategies/jwt.strategy';
import { AuthenticatedUserResponseDto, LoginResponseDto, PublicUserResponseDto } from './dto/auth-response.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@ApiOperation({ summary: 'Register a new user' })
	@ApiCreatedResponse({ type: PublicUserResponseDto })
	@ApiResponse({ status: 409, description: 'Email is already registered' })
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post('login')
	@ApiOperation({ summary: 'Login with email and password' })
	@ApiResponse({ status: 200, type: LoginResponseDto })
	@ApiResponse({ status: 401, description: 'Invalid email or password' })
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get the authenticated user payload' })
	@ApiResponse({ status: 200, type: AuthenticatedUserResponseDto })
	@ApiResponse({ status: 401, description: 'Missing or invalid bearer token' })
	getCurrentUser(@CurrentUser() user: JwtPayload) {
		return user;
	}
}
