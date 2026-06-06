import { Inject, Injectable } from '@nestjs/common';
import {
  type ITramiteRepository,
  TRAMITE_REPOSITORY,
} from '../domain/tramite.repository';
import {
  type ITramiteClassifier,
  TRAMITE_CLASSIFIER,
} from '../domain/tramite-classifier.port';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/modules/department/domain/department.repository';
import { TramiteEntity } from '../domain/tramite.entity';
import { randomUUID } from 'crypto';

export interface SubmittramiteInput {
  title: string;
  extractedText: string; // texto extraído del PDF en el frontend
  citizenId: string;
  attachment: {
    fileName: string;
    fileUrl: string;
    mimeType: string;
    sizeBytes: number;
  };
}

const FALLBACK_SLUG = 'secretaria-general';
const CONFIDENCE_THRESHOLD = 0.5;

@Injectable()
export class SubmitTramiteUseCase {
  constructor(
    @Inject(TRAMITE_REPOSITORY)
    private readonly tramiteRepo: ITramiteRepository,
    @Inject(TRAMITE_CLASSIFIER)
    private readonly classifier: ITramiteClassifier,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: IDepartmentRepository,
  ) {}

  async execute(input: SubmittramiteInput): Promise<TramiteEntity> {
    // 1. Crear trámite en PENDING
    const tramite = await this.tramiteRepo.create({
      id: randomUUID(),
      title: input.title,
      description: input.extractedText,
      citizenId: input.citizenId,
    });

    // 2. Guardar adjunto
    await this.tramiteRepo.createAttachment({
      id: randomUUID(),
      tramiteId: tramite.id,
      fileName: input.attachment.fileName,
      fileUrl: input.attachment.fileUrl,
      mimeType: input.attachment.mimeType,
      sizeBytes: input.attachment.sizeBytes,
    });

    // 3. Obtener slugs activos para el prompt
    const departments = await this.departmentRepo.findAllActive();
    const availableSlugs = departments.map((d) => d.slug);

    // 4. Clasificar con LLM
    const result = await this.classifier.classify(
      input.extractedText,
      availableSlugs,
    );

    // 5. Determinar departamento — fallback si confianza baja o slug inválido
    const resolvedSlug =
      result.confidence >= CONFIDENCE_THRESHOLD &&
      availableSlugs.includes(result.departmentSlug)
        ? result.departmentSlug
        : FALLBACK_SLUG;

    const department = await this.departmentRepo.findBySlug(resolvedSlug);

    // 6. Actualizar trámite a CLASSIFIED
    const classified = await this.tramiteRepo.updateClassification(tramite.id, {
      departmentId: department!.id,
      aiConfidence: result.confidence,
      aiRawResponse: result.rawResponse,
    });

    return classified;
  }
}
