import { UserEntity } from './user.entity';

export interface CreateUserInput {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  dni: string;
  phone?: string | null;
  role?: 'CITIZEN' | 'SECRETARY';
}

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByDni(dni: string): Promise<UserEntity | null>;
  create(data: CreateUserInput): Promise<UserEntity>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
