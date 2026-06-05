import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FindUserByIdUseCase } from './application/find-user-by-id.use-case';
import { USER_REPOSITORY } from './domain/user.repository.interface';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
    FindUserByIdUseCase,
  ],
  exports: [FindUserByIdUseCase, USER_REPOSITORY],
})
export class UserModule {}
