export type TramiteStatus =
  | 'PENDING'
  | 'CLASSIFIED'
  | 'IN_REVIEW'
  | 'RESOLVED'
  | 'REJECTED';

export interface TramiteProps {
  id: string;
  title: string;
  description: string;
  status: TramiteStatus;
  citizenId: string;
  departmentId?: string | null;
  aiConfidence?: number | null;
  aiRawResponse?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class TramiteEntity {
  constructor(private readonly props: TramiteProps) {}

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get status() {
    return this.props.status;
  }

  get citizenId() {
    return this.props.citizenId;
  }

  get departmentId() {
    return this.props.departmentId ?? null;
  }

  get aiConfidence() {
    return this.props.aiConfidence ?? null;
  }

  get aiRawResponse() {
    return this.props.aiRawResponse ?? null;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  isPending(): boolean {
    return this.props.status === 'PENDING';
  }

  isClassified(): boolean {
    return this.props.status === 'CLASSIFIED';
  }

  isResolved(): boolean {
    return this.props.status === 'RESOLVED';
  }

  isRejected(): boolean {
    return this.props.status === 'REJECTED';
  }

  toObject(): TramiteProps {
    return { ...this.props };
  }
}
