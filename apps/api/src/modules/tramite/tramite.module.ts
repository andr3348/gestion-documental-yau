import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DepartmentModule } from '../department/department.module';
import { TRAMITE_REPOSITORY } from './domain/tramite.repository';
import { TRAMITE_CLASSIFIER } from './domain/tramite-classifier.port';
import { TramitePrismaRepository } from './infrastructure/tramite.prisma.repository';
import { OpenRouterClassifier } from './infrastructure/openrouter.classifier';
import { SubmitTramiteUseCase } from './application/submit-tramite.use-case';
import { UpdateStatusUseCase } from './application/update-status.use-case';
import { GetTramitesUseCase } from './application/get-tramites.use-case';
import { TramiteController } from './presentation/tramite.controller';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, DepartmentModule, NotificationModule, UserModule],
  providers: [
    SubmitTramiteUseCase,
    UpdateStatusUseCase,
    GetTramitesUseCase,
    { provide: TRAMITE_REPOSITORY, useClass: TramitePrismaRepository },
    { provide: TRAMITE_CLASSIFIER, useClass: OpenRouterClassifier },
  ],
  controllers: [TramiteController],
})
export class TramiteModule {}
