import { DepartmentEntity } from './department.entity';

export interface IDepartmentRepository {
  findBySlug(slug: string): Promise<DepartmentEntity | null>;
  findById(id: string): Promise<DepartmentEntity | null>;
  findAllActive(): Promise<DepartmentEntity[]>;
}

export const DEPARTMENT_REPOSITORY = Symbol('IDepartmentRepository');
