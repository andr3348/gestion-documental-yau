import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  INotificationRepository,
  CreateNotificationInput,
} from '../domain/notification.repository';
import {
  NotificationEntity,
  DeliveryStatus,
} from '../domain/notification.entity';

@Injectable()
export class NotificationPrismaRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNotificationInput): Promise<NotificationEntity> {
    const record = await this.prisma.notification.create({
      data: {
        id: data.id,
        tramiteId: data.tramiteId,
        userId: data.userId,
        subject: data.subject,
        body: data.body,
        channel: 'EMAIL',
        deliveryStatus: 'QUEUED',
      },
    });
    return new NotificationEntity(record);
  }

  async updateDeliveryStatus(
    id: string,
    status: DeliveryStatus,
    sentAt?: Date,
  ): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { deliveryStatus: status, sentAt: sentAt ?? null },
    });
  }
}
