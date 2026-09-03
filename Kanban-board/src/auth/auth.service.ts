import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type PublicUser = Pick<User, 'id' | 'name' | 'email' | 'createdAt' | 'updatedAt'>;
type JwtPayload = { sub: string; email: string };

@Injectable()
export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	async register(registerDto: RegisterDto): Promise<PublicUser> {
		const existingUser = await this.authRepository.findByEmail(registerDto.email);
		if (existingUser) {
			throw new ConflictException('Email is already registered');
		}

		const passwordHash = await bcrypt.hash(registerDto.password, 12);
		try {
			const user = await this.authRepository.createUser({
				name: registerDto.name,
				email: registerDto.email,
				passwordHash,
			});
			return this.toPublicUser(user);
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new ConflictException('Email is already registered');
			}
			throw error;
		}
	}

	async login(loginDto: LoginDto): Promise<{ accessToken: string; user: PublicUser }> {
		const user = await this.authRepository.findByEmail(loginDto.email);
		const passwordMatches = user ? await bcrypt.compare(loginDto.password, user.passwordHash) : false;
		if (!user || !passwordMatches) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const payload: JwtPayload = { sub: user.id, email: user.email };
		return { accessToken: await this.jwtService.signAsync(payload), user: this.toPublicUser(user) };
	}

	private toPublicUser(user: User): PublicUser {
		const { passwordHash: _passwordHash, ...publicUser } = user;
		return publicUser;
	}
}
