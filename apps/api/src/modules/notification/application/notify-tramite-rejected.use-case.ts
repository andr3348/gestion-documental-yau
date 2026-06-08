import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type INotificationSender,
  NOTIFICATION_SENDER,
} from '../domain/notification.sender.port';
import {
  type INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../domain/notification.repository';

export interface NotifyTramiteRejectedInput {
  tramiteId: string;
  citizenId: string;
  citizenEmail: string;
  citizenName: string;
  tramiteTitle: string;
  rejectionReason: string;
}

@Injectable()
export class NotifyTramiteRejectedUseCase {
  private readonly logger = new Logger(NotifyTramiteRejectedUseCase.name);

  constructor(
    @Inject(NOTIFICATION_SENDER)
    private readonly sender: INotificationSender,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(input: NotifyTramiteRejectedInput): Promise<void> {
    const subject = `Tu trámite "${input.tramiteTitle}" ha sido rechazado`;
    const html = this.buildRejectedEmail(input);

    const notification = await this.notificationRepo.create({
      id: randomUUID(),
      tramiteId: input.tramiteId,
      userId: input.citizenId,
      subject,
      body: html,
    });

    try {
      await this.sender.sendEmail({
        to: input.citizenEmail,
        subject,
        html,
      });
      await this.notificationRepo.updateDeliveryStatus(
        notification.id,
        'SENT',
        new Date(),
      );
    } catch (error) {
      this.logger.error(
        `Failed to send REJECTED email for tramite ${input.tramiteId}`,
        error,
      );
      await this.notificationRepo.updateDeliveryStatus(
        notification.id,
        'FAILED',
      );
    }
  }

  private buildRejectedEmail(input: NotifyTramiteRejectedInput): string {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#dc2626;">Trámite Rechazado</h2>
        <p>Estimado/a <strong>${input.citizenName}</strong>,</p>
        <p>
          Su trámite <strong>"${input.tramiteTitle}"</strong> ha sido <strong>rechazado</strong>
          por el siguiente motivo:
        </p>
        <blockquote style="border-left:4px solid #dc2626;padding-left:12px;color:#374151;">
          ${input.rejectionReason}
        </blockquote>
        <p>Puede corregir su trámite y volver a enviarlo desde el sistema.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#6b7280;font-size:12px;">Municipalidad — Sistema de Trámites Digitales</p>
      </div>
    `;
  }
}
