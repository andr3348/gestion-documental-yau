import { NotificationEntity, DeliveryStatus } from './notification.entity';

export interface CreateNotificationInput {
  id: string;
  tramiteId: string;
  userId: string;
  subject: string;
  body: string;
}

export interface INotificationRepository {
  create(data: CreateNotificationInput): Promise<NotificationEntity>;
  updateDeliveryStatus(
    id: string,
    status: DeliveryStatus,
    sentAt?: Date,
  ): Promise<void>;
}

export const NOTIFICATION_REPOSITORY = Symbol('INotificationRepository');
