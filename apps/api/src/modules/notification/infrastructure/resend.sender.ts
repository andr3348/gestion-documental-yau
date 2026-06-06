import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import {
  INotificationSender,
  SendEmailInput,
} from '../domain/notification.sender.port';

@Injectable()
export class ResendSender implements INotificationSender {
  private readonly logger = new Logger(ResendSender.name);
  private readonly resend = new Resend(`${process.env.RESEND_API_KEY}`);
  private readonly from =
    process.env.RESEND_FROM_EMAIL ?? 'tramites@municipalidad.gob.pe';

  async sendEmail(input: SendEmailInput): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      this.logger.error('Resend error', error);
      throw new Error(error.message);
    }
  }
}
