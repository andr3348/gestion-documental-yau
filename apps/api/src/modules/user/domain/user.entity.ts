import { Role } from './value-objects/role.vo';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  dni: string;
  phone?: string | null;
  role: Role;
  departmentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity {
  private readonly props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static create(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  // --- Getters ---
  get id(): string {
    return this.props.id;
  }
  get email(): string {
    return this.props.email;
  }
  get passwordHash(): string {
    return this.props.passwordHash;
  }
  get fullName(): string {
    return this.props.fullName;
  }
  get dni(): string {
    return this.props.dni;
  }
  get phone(): string | null {
    return this.props.phone ?? null;
  }
  get role(): Role {
    return this.props.role;
  }
  get departmentId(): string | null {
    return this.props.departmentId ?? null;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --- Domain methods ---
  isSecretary(): boolean {
    return this.props.role === Role.SECRETARY;
  }

  isCitizen(): boolean {
    return this.props.role === Role.CITIZEN;
  }

  belongsToDepartment(departmentId: string): boolean {
    return this.props.departmentId === departmentId;
  }
}
