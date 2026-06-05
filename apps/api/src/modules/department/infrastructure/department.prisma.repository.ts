import { Injectable } from '@nestjs/common';
import { IDepartmentRepository } from '../domain/department.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepartmentEntity } from '../domain/department.entity';
import { Department as PrismaDepartment } from '@yau/database';

@Injectable()
export class DepartmentPrismaRepository implements IDepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string): Promise<DepartmentEntity | null> {
    const department = await this.prisma.department.findUnique({
      where: { slug },
    });
    return department ? this.toEntity(department) : null;
  }

  async findById(id: string): Promise<DepartmentEntity | null> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });
    return department ? this.toEntity(department) : null;
  }

  async findAllActive(): Promise<DepartmentEntity[]> {
    const departments = await this.prisma.department.findMany({
      where: { isActive: true },
    });
    return departments.map((dept) => this.toEntity(dept));
  }

  private toEntity(raw: PrismaDepartment): DepartmentEntity {
    return new DepartmentEntity(raw);
  }
}
