import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  EmailAlreadyExistsError,
  DniAlreadyExistsError,
} from '../domain/auth.errors';
import { UserEntity } from '../../user/domain/user.entity';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/user.repository.interface';

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  dni: string;
  phone?: string | null;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(input: RegisterInput): Promise<UserEntity> {
    const [byEmail, byDni] = await Promise.all([
      this.userRepo.findByEmail(input.email),
      this.userRepo.findByDni(input.dni),
    ]);

    if (byEmail) throw new EmailAlreadyExistsError();
    if (byDni) throw new DniAlreadyExistsError();

    const passwordHash = await bcrypt.hash(input.password, 10);

    return this.userRepo.create({
      id: randomUUID(),
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      dni: input.dni,
      phone: input.phone ?? null,
    });
  }
}
