import { Inject, Injectable } from '@nestjs/common';
import {
  type ITramiteRepository,
  TRAMITE_REPOSITORY,
} from '../domain/tramite.repository';
import { TramiteEntity } from '../domain/tramite.entity';

@Injectable()
export class GetTramitesUseCase {
  constructor(
    @Inject(TRAMITE_REPOSITORY)
    private readonly tramiteRepo: ITramiteRepository,
  ) {}

  async getByDepartment(departmentId: string): Promise<TramiteEntity[]> {
    return this.tramiteRepo.findByDepartmentId(departmentId);
  }

  async getByCitizen(citizenId: string): Promise<TramiteEntity[]> {
    return this.tramiteRepo.findByCitizenId(citizenId);
  }
}
