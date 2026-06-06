import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DEPARTMENT_REPOSITORY } from './domain/department.repository';
import { DepartmentPrismaRepository } from './infrastructure/department.prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    { provide: DEPARTMENT_REPOSITORY, useClass: DepartmentPrismaRepository },
  ],
  exports: [DEPARTMENT_REPOSITORY],
})
export class DepartmentModule {}
