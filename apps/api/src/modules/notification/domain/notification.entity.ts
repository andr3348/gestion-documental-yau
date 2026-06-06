export type NotificationChannel = 'EMAIL';
export type DeliveryStatus = 'QUEUED' | 'SENT' | 'FAILED';

export interface NotificationProps {
  id: string;
  tramiteId: string;
  userId: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
  deliveryStatus: DeliveryStatus;
  sentAt?: Date | null;
}

export class NotificationEntity {
  constructor(private readonly props: NotificationProps) {}

  get id(): string {
    return this.props.id;
  }
  get tramiteId(): string {
    return this.props.tramiteId;
  }
  get userId(): string {
    return this.props.userId;
  }
  get channel(): NotificationChannel {
    return this.props.channel;
  }
  get subject(): string {
    return this.props.subject;
  }
  get body(): string {
    return this.props.body;
  }
  get deliveryStatus(): DeliveryStatus {
    return this.props.deliveryStatus;
  }
  get sentAt(): Date | null {
    return this.props.sentAt ?? null;
  }
}
