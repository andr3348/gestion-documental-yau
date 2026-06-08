import { Controller, Get, Inject } from '@nestjs/common';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from '../domain/department.repository';
import type { DepartmentEntity } from '../domain/department.entity';

@Controller('departments')
export class DepartmentController {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: IDepartmentRepository,
  ) {}

  @Get()
  async findAll(): Promise<
    { id: string; name: string; slug: string; description: string | null }[]
  > {
    const departments = await this.departmentRepo.findAllActive();
    return departments.map((d: DepartmentEntity) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      description: d.description,
    }));
  }
}
