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

export interface NotifyTramiteResolvedInput {
  tramiteId: string;
  citizenEmail: string;
  citizenName: string;
  tramiteTitle: string;
  departmentName: string;
}

@Injectable()
export class NotifyTramiteResolvedUseCase {
  private readonly logger = new Logger(NotifyTramiteResolvedUseCase.name);

  constructor(
    @Inject(NOTIFICATION_SENDER)
    private readonly sender: INotificationSender,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(input: NotifyTramiteResolvedInput): Promise<void> {
    const subject = `Tu trámite "${input.tramiteTitle}" ha sido resuelto`;
    const html = this.buildResolvedEmail(input);

    const notification = await this.notificationRepo.create({
      id: randomUUID(),
      tramiteId: input.tramiteId,
      userId: input.citizenEmail, // se resuelve en el use-case llamador
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
        `Failed to send RESOLVED email for tramite ${input.tramiteId}`,
        error,
      );
      await this.notificationRepo.updateDeliveryStatus(
        notification.id,
        'FAILED',
      );
    }
  }

  private buildResolvedEmail(input: NotifyTramiteResolvedInput): string {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#16a34a;">Trámite Resuelto</h2>
        <p>Estimado/a <strong>${input.citizenName}</strong>,</p>
        <p>
          Su trámite <strong>"${input.tramiteTitle}"</strong> atendido por el área de
          <strong>${input.departmentName}</strong> ha sido <strong>resuelto satisfactoriamente</strong>.
        </p>
        <p>Puede ingresar al sistema para ver el detalle completo.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#6b7280;font-size:12px;">Municipalidad — Sistema de Trámites Digitales</p>
      </div>
    `;
  }
}
