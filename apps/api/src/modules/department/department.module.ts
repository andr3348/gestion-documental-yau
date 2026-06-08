import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DEPARTMENT_REPOSITORY } from './domain/department.repository';
import { DepartmentPrismaRepository } from './infrastructure/department.prisma.repository';
import { DepartmentController } from './presentation/department.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DepartmentController],
  providers: [
    { provide: DEPARTMENT_REPOSITORY, useClass: DepartmentPrismaRepository },
  ],
  exports: [DEPARTMENT_REPOSITORY],
})
export class DepartmentModule {}
