export interface DepartmentProps {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
}

export class DepartmentEntity {
  constructor(private readonly props: DepartmentProps) {}

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }

  get description() {
    return this.props.description ?? null;
  }

  get isActive() {
    return this.props.isActive;
  }
}
