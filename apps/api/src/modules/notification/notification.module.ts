import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { NOTIFICATION_SENDER } from './domain/notification.sender.port';
import { NOTIFICATION_REPOSITORY } from './domain/notification.repository';
import { ResendSender } from './infrastructure/resend.sender';
import { NotificationPrismaRepository } from './infrastructure/notification.prisma.repository';
import { NotifyTramiteResolvedUseCase } from './application/notify-tramite-resolved.use-case';
import { NotifyTramiteRejectedUseCase } from './application/notify-tramite-rejected.use-case';

@Module({
  imports: [PrismaModule],
  providers: [
    NotifyTramiteResolvedUseCase,
    NotifyTramiteRejectedUseCase,
    { provide: NOTIFICATION_SENDER, useClass: ResendSender },
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationPrismaRepository,
    },
  ],
  exports: [NotifyTramiteResolvedUseCase, NotifyTramiteRejectedUseCase],
})
export class NotificationModule {}
