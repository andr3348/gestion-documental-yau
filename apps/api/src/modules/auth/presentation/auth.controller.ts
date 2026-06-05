import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterUseCase } from '../application/register.use-case';
import { LoginUseCase } from '../application/login.use-case';
import { RegisterDto } from './dtos/register.dto';
import {
  DniAlreadyExistsError,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from '../domain/auth.errors';
import { LoginDto } from './dtos/login.dto';
import { UserEntity } from 'src/modules/user/domain/user.entity';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { UserResponseDto } from 'src/modules/user/presentation/dtos/user-response.dto';
import { CurrentUser } from './decorators/current-user.decorator';

const COOKIE_NAME = 'access_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 1000 * 60 * 60 * 8, // 8h
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const user = await this.registerUseCase.execute(dto);
      return UserResponseDto.fromEntity(user);
    } catch (e) {
      if (e instanceof EmailAlreadyExistsError)
        throw new ConflictException(e.message);
      if (e instanceof DniAlreadyExistsError)
        throw new ConflictException(e.message);
      throw e;
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken } = await this.loginUseCase.execute(dto);
      res.cookie(COOKIE_NAME, accessToken, COOKIE_OPTIONS);
      return { message: 'Login exitoso' };
    } catch (e) {
      if (e instanceof InvalidCredentialsError)
        throw new UnauthorizedException(e.message);
      throw e;
    }
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME);
    return { message: 'Logout exitoso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: UserEntity) {
    return UserResponseDto.fromEntity(user);
  }
}
