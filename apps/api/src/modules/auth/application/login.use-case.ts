import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InvalidCredentialsError } from '../domain/auth.errors';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/user.repository.interface';
import { JwtService } from '@nestjs/jwt';

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  departmentId: string | null;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInput): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) throw new InvalidCredentialsError();

    const match = await bcrypt.compare(input.password, user.passwordHash);
    if (!match) throw new InvalidCredentialsError();

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
