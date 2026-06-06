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
import {
  type IDepartmentRepository,
  DEPARTMENT_REPOSITORY,
} from '../../department/domain/department.repository';
import { NotifyTramiteResolvedUseCase } from '../../notification/application/notify-tramite-resolved.use-case';
import { NotifyTramiteRejectedUseCase } from '../../notification/application/notify-tramite-rejected.use-case';
import { TramiteEntity, TramiteStatus } from '../domain/tramite.entity';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/user.repository.interface';

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
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: IDepartmentRepository,
    private readonly notifyResolved: NotifyTramiteResolvedUseCase,
    private readonly notifyRejected: NotifyTramiteRejectedUseCase,
  ) {}

  async execute(input: UpdateStatusInput): Promise<TramiteEntity> {
    const tramite = await this.tramiteRepo.findById(input.tramiteId);
    if (!tramite) throw new NotFoundException('Trámite no encontrado');

    if (tramite.departmentId !== input.secretaryDepartmentId) {
      throw new ForbiddenException('No tienes acceso a este trámite');
    }

    if (input.newStatus === 'REJECTED' && !input.comment) {
      throw new ForbiddenException(
        'El motivo es obligatorio al rechazar un trámite',
      );
    }

    const updated = await this.tramiteRepo.updateStatus(
      input.tramiteId,
      input.newStatus,
      input.comment,
      input.secretaryId,
    );

    // Notificar solo en estados finales
    if (input.newStatus === 'RESOLVED' || input.newStatus === 'REJECTED') {
      const [citizen, department] = await Promise.all([
        this.userRepo.findById(tramite.citizenId),
        this.departmentRepo.findById(tramite.departmentId!),
      ]);

      if (citizen && department) {
        if (input.newStatus === 'RESOLVED') {
          // fire-and-forget — no bloquea la respuesta al secretario
          this.notifyResolved
            .execute({
              tramiteId: tramite.id,
              citizenEmail: citizen.email,
              citizenName: citizen.fullName,
              tramiteTitle: tramite.title,
              departmentName: department.name,
            })
            .catch(() => null);
        } else {
          this.notifyRejected
            .execute({
              tramiteId: tramite.id,
              citizenEmail: citizen.email,
              citizenName: citizen.fullName,
              tramiteTitle: tramite.title,
              rejectionReason: input.comment!,
            })
            .catch(() => null);
        }
      }
    }

    return updated;
  }
}
