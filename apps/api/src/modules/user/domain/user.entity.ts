export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  dni: string;
  phone?: string | null;
  role: 'CITIZEN' | 'SECRETARY' | 'ADMIN';
  departmentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity {
  constructor(private readonly props: UserProps) {}

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
  get role(): 'CITIZEN' | 'SECRETARY' | 'ADMIN' {
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
    return this.props.role === 'SECRETARY';
  }

  isCitizen(): boolean {
    return this.props.role === 'CITIZEN';
  }

  belongsToDepartment(departmentId: string): boolean {
    return this.props.departmentId === departmentId;
  }
}
