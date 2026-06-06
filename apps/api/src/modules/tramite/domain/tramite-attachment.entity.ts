export interface TramiteAttachmentProps {
  id: string;
  tramiteId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: Date;
}

export class TramiteAttachmentEntity {
  constructor(private readonly props: TramiteAttachmentProps) {}

  get id(): string {
    return this.props.id;
  }
  get tramiteId(): string {
    return this.props.tramiteId;
  }
  get fileName(): string {
    return this.props.fileName;
  }
  get fileUrl(): string {
    return this.props.fileUrl;
  }
  get mimeType(): string {
    return this.props.mimeType;
  }
  get sizeBytes(): number {
    return this.props.sizeBytes;
  }
  get uploadedAt(): Date {
    return this.props.uploadedAt;
  }
}
