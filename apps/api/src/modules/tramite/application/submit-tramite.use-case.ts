import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type ITramiteRepository,
  TRAMITE_REPOSITORY,
} from '../domain/tramite.repository';
import {
  type ITramiteClassifier,
  TRAMITE_CLASSIFIER,
} from '../domain/tramite-classifier.port';
import {
  type IDepartmentRepository,
  DEPARTMENT_REPOSITORY,
} from '../../department/domain/department.repository';
import { PdfExtractor } from '../infrastructure/pdf.extractor';
import { TramiteEntity } from '../domain/tramite.entity';

export interface SubmitTramiteInput {
  title: string;
  citizenId: string;
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
    savedPath: string; // ruta local donde multer guardó el archivo
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

  async execute(input: SubmitTramiteInput): Promise<TramiteEntity> {
    // 1. Extraer texto del PDF
    const extractedText = await PdfExtractor.extract(input.file.buffer);

    // 2. Crear trámite PENDING
    const tramite = await this.tramiteRepo.create({
      id: randomUUID(),
      title: input.title,
      description: extractedText,
      citizenId: input.citizenId,
    });

    // 3. Guardar adjunto con ruta local como fileUrl
    await this.tramiteRepo.createAttachment({
      id: randomUUID(),
      tramiteId: tramite.id,
      fileName: input.file.originalname,
      fileUrl: input.file.savedPath,
      mimeType: input.file.mimetype,
      sizeBytes: input.file.size,
    });

    // 4. Clasificar con LLM
    const departments = await this.departmentRepo.findAllActive();
    const availableSlugs = departments.map((d) => d.slug);
    const result = await this.classifier.classify(
      extractedText,
      availableSlugs,
    );

    // 5. Resolver departamento con fallback
    const resolvedSlug =
      result.confidence >= CONFIDENCE_THRESHOLD &&
      availableSlugs.includes(result.departmentSlug)
        ? result.departmentSlug
        : FALLBACK_SLUG;

    const department = await this.departmentRepo.findBySlug(resolvedSlug);

    // 6. Actualizar a CLASSIFIED
    return this.tramiteRepo.updateClassification(tramite.id, {
      departmentId: department!.id,
      aiConfidence: result.confidence,
      aiRawResponse: result.rawResponse,
    });
  }
}
