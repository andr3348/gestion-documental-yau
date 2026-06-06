import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubmitTramiteUseCase } from '../application/submit-tramite.use-case';
import { UpdateStatusUseCase } from '../application/update-status.use-case';
import { GetTramitesUseCase } from '../application/get-tramites.use-case';
import { SubmitTramiteDto } from './dtos/submit-tramite.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { JwtAuthGuard } from '../../../shared/guards/jwt.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserEntity } from '../../user/domain/user.entity';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';

@Controller('tramites')
@UseGuards(JwtAuthGuard)
export class TramiteController {
  constructor(
    private readonly submitTramite: SubmitTramiteUseCase,
    private readonly updateStatus: UpdateStatusUseCase,
    private readonly getTramites: GetTramitesUseCase,
  ) {}

  // Ciudadano: envía un trámite
  @Post()
  @Roles('CITIZEN')
  @UseGuards(RolesGuard)
  async submit(@Body() dto: SubmitTramiteDto, @CurrentUser() user: UserEntity) {
    const tramite = await this.submitTramite.execute({
      title: dto.title,
      extractedText: dto.extractedText,
      citizenId: user.id,
      attachment: {
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
        mimeType: dto.mimeType,
        sizeBytes: dto.sizeBytes,
      },
    });
    return tramite.toObject();
  }

  // Ciudadano: lista sus trámites
  @Get('my')
  @Roles('CITIZEN')
  @UseGuards(RolesGuard)
  async getMine(@CurrentUser() user: UserEntity) {
    const tramites = await this.getTramites.getByCitizen(user.id);
    return tramites.map((t) => t.toObject());
  }

  // Secretario: lista trámites de su área
  @Get('department')
  @Roles('SECRETARY')
  @UseGuards(RolesGuard)
  async getByDepartment(@CurrentUser() user: UserEntity) {
    if (!user.departmentId) return [];
    const tramites = await this.getTramites.getByDepartment(user.departmentId);
    return tramites.map((t) => t.toObject());
  }

  // Secretario: cambia el estado de un trámite
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
