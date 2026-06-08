import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ITramiteRepository,
  CreateTramiteInput,
  CreateAttachmentInput,
  UpdateClassificationInput,
} from '../domain/tramite.repository';
import { TramiteEntity } from '../domain/tramite.entity';
import type { TramiteStatus } from '../domain/tramite.entity';
import { TramiteAttachmentEntity } from '../domain/tramite-attachment.entity';

import { randomUUID } from 'crypto';

@Injectable()
export class TramitePrismaRepository implements ITramiteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTramiteInput): Promise<TramiteEntity> {
    const record = await this.prisma.tramite.create({ data });
    return new TramiteEntity(record);
  }

  async findById(id: string): Promise<TramiteEntity | null> {
    const record = await this.prisma.tramite.findUnique({ where: { id } });
    return record ? new TramiteEntity(record) : null;
  }

  async findByDepartmentId(departmentId: string): Promise<TramiteEntity[]> {
    const records = await this.prisma.tramite.findMany({
      where: { departmentId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => new TramiteEntity(r));
  }

  async findByCitizenId(citizenId: string): Promise<TramiteEntity[]> {
    const records = await this.prisma.tramite.findMany({
      where: { citizenId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => new TramiteEntity(r));
  }

  async updateStatus(
    id: string,
    status: TramiteStatus,
    comment?: string,
    changedById?: string,
  ): Promise<TramiteEntity> {
    const current = await this.prisma.tramite.findUnique({
      where: { id },
      select: { status: true },
    });

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.tramite.update({
        where: { id },
        data: { status },
      });
      await tx.statusHistory.create({
        data: {
          id: randomUUID(),
          tramiteId: id,
          fromStatus: current!.status,
          toStatus: status,
          comment,
          changedById,
        },
      });
      return new TramiteEntity(updated);
    });
  }

  async updateClassification(
    id: string,
    data: UpdateClassificationInput,
  ): Promise<TramiteEntity> {
    const [record] = await this.prisma.$transaction([
      this.prisma.tramite.update({
        where: { id },
        data: {
          departmentId: data.departmentId,
          aiConfidence: data.aiConfidence,
          aiRawResponse: data.aiRawResponse,
          status: 'CLASSIFIED',
        },
      }),
      this.prisma.statusHistory.create({
        data: {
          id: randomUUID(),
          tramiteId: id,
          fromStatus: 'PENDING',
          toStatus: 'CLASSIFIED',
          comment: `Clasificado por IA con confianza ${(data.aiConfidence * 100).toFixed(0)}%`,
          changedById: null,
        },
      }),
    ]);
    return new TramiteEntity(record);
  }

  async createAttachment(
    data: CreateAttachmentInput,
  ): Promise<TramiteAttachmentEntity> {
    const record = await this.prisma.tramiteAttachment.create({ data });
    return new TramiteAttachmentEntity(record);
  }

  async findAttachmentsByTramiteId(
    tramiteId: string,
  ): Promise<TramiteAttachmentEntity[]> {
    const records = await this.prisma.tramiteAttachment.findMany({
      where: { tramiteId },
    });
    return records.map((r) => new TramiteAttachmentEntity(r));
  }
}
