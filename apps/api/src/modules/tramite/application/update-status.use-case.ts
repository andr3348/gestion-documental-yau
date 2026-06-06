import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  type ITramiteRepository,
  TRAMITE_REPOSITORY,
} from '../domain/tramite.repository';
import { TramiteEntity, TramiteStatus } from '../domain/tramite.entity';

export interface UpdateStatusInput {
  tramiteId: string;
  newStatus: TramiteStatus;
  comment?: string;
  secretaryId: string;
  secretaryDepartmentId: string;
}

@Injectable()
export class UpdateStatusUseCase {
  constructor(
    @Inject(TRAMITE_REPOSITORY)
    private readonly tramiteRepo: ITramiteRepository,
  ) {}

  async execute(input: UpdateStatusInput): Promise<TramiteEntity> {
    const tramite = await this.tramiteRepo.findById(input.tramiteId);
    if (!tramite) throw new NotFoundException('Trámite no encontrado');

    // Solo el secretario del área asignada puede cambiar el estado
    if (tramite.departmentId !== input.secretaryDepartmentId) {
      throw new ForbiddenException('No tienes acceso a este trámite');
    }

    if (input.newStatus === 'REJECTED' && !input.comment) {
      throw new ForbiddenException(
        'El motivo es obligatorio al rechazar un trámite',
      );
    }

    return this.tramiteRepo.updateStatus(
      input.tramiteId,
      input.newStatus,
      input.comment,
      input.secretaryId,
    );
  }
}
