import { TramiteAttachmentEntity } from './tramite-attachment.entity';
import { TramiteEntity, TramiteStatus } from './tramite.entity';

export interface CreateTramiteInput {
  id: string;
  title: string;
  description: string;
  citizenId: string;
}

export interface CreateAttachmentInput {
  id: string;
  tramiteId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
}

export interface UpdateClassificationInput {
  departmentId: string;
  aiConfidence: number;
  aiRawResponse: string;
}

export interface ITramiteRepository {
  create(data: CreateTramiteInput): Promise<TramiteEntity>;
  findById(id: string): Promise<TramiteEntity | null>;
  findByDepartmentId(departmentId: string): Promise<TramiteEntity[]>;
  findByCitizenId(citizenId: string): Promise<TramiteEntity[]>;
  updateStatus(
    id: string,
    status: TramiteStatus,
    comment?: string,
    changedById?: string,
  ): Promise<TramiteEntity>;
  updateClassification(
    id: string,
    data: UpdateClassificationInput,
  ): Promise<TramiteEntity>;
  createAttachment(
    data: CreateAttachmentInput,
  ): Promise<TramiteAttachmentEntity>;
  findAttachmentsByTramiteId(
    tramiteId: string,
  ): Promise<TramiteAttachmentEntity[]>;
}

export const TRAMITE_REPOSITORY = Symbol('ITramiteRepository');
