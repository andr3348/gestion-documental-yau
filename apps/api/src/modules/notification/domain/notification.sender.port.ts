export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export interface INotificationSender {
  sendEmail(input: SendEmailInput): Promise<void>;
}

export const NOTIFICATION_SENDER = Symbol('INotificationSender');
