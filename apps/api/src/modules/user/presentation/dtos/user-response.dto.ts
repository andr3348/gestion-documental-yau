import { UserEntity } from '../../domain/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  dni: string;
  phone: string | null;
  role: string;
  departmentId: string | null;
  createdAt: Date;

  static fromEntity(entity: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.fullName = entity.fullName;
    dto.dni = entity.dni;
    dto.phone = entity.phone ?? null;
    dto.role = entity.role;
    dto.departmentId = entity.departmentId ?? null;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
