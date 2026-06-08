import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { SubmitTramiteUseCase } from '../application/submit-tramite.use-case';
import { UpdateStatusUseCase } from '../application/update-status.use-case';
import { GetTramitesUseCase } from '../application/get-tramites.use-case';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { JwtAuthGuard } from '../../../shared/guards/jwt.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserEntity } from '../../user/domain/user.entity';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import { mkdir } from 'fs/promises';
import { createWriteStream } from 'fs';

class SubmitTramiteBodyDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

@Controller('tramites')
@UseGuards(JwtAuthGuard)
export class TramiteController {
  constructor(
    private readonly submitTramite: SubmitTramiteUseCase,
    private readonly updateStatus: UpdateStatusUseCase,
    private readonly getTramites: GetTramitesUseCase,
  ) {}

  @Post()
  @Roles('CITIZEN')
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
      fileFilter: (_, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Solo se permiten archivos PDF'), false);
        }
      },
    }),
  )
  async submit(
    @Body() dto: SubmitTramiteBodyDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserEntity,
  ) {
    // Guardar en disco manualmente
    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const fileName = `${randomUUID()}.pdf`;
    const savedPath = join(uploadsDir, fileName);
    createWriteStream(savedPath).end(file.buffer);

    const tramite = await this.submitTramite.execute({
      title: dto.title,
      citizenId: user.id,
      file: {
        buffer: file.buffer, // ← disponible porque usamos memoryStorage
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        savedPath,
      },
    });
    return tramite.toObject();
  }

  @Get('my')
  @Roles('CITIZEN')
  @UseGuards(RolesGuard)
  async getMine(@CurrentUser() user: UserEntity) {
    const tramites = await this.getTramites.getByCitizen(user.id);
    return tramites.map((t) => t.toObject());
  }

  @Get('department')
  @Roles('SECRETARY')
  @UseGuards(RolesGuard)
  async getByDepartment(@CurrentUser() user: UserEntity) {
    if (!user.departmentId) return [];
    const tramites = await this.getTramites.getByDepartment(user.departmentId);
    return tramites.map((t) => t.toObject());
  }

  @Patch(':id/status')
  @HttpCode(200)
  @Roles('SECRETARY')
  @UseGuards(RolesGuard)
  async updateTramiteStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: UserEntity,
  ) {
    const tramite = await this.updateStatus.execute({
      tramiteId: id,
      newStatus: dto.status,
      comment: dto.comment,
      secretaryId: user.id,
      secretaryDepartmentId: user.departmentId!,
    });
    return tramite.toObject();
  }
}
