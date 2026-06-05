import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUserInput,
  IUserRepository,
} from '../domain/user.repository.interface';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../domain/user.entity';
import { User as PrismaUser } from '@yau/database';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(raw: PrismaUser): UserEntity {
    return new UserEntity(raw);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toEntity(user) : null;
  }

  async findByDni(dni: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { dni } });
    return user ? this.toEntity(user) : null;
  }

  async create(data: CreateUserInput): Promise<UserEntity> {
    const user = await this.prisma.user.create({ data });
    return this.toEntity(user);
  }
}
