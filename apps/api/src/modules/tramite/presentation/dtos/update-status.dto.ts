import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TramiteStatus } from '../../domain/tramite.entity';

const ALLOWED_TRANSITIONS: TramiteStatus[] = [
  'IN_REVIEW',
  'RESOLVED',
  'REJECTED',
];

export class UpdateStatusDto {
  @IsEnum(ALLOWED_TRANSITIONS)
  status: TramiteStatus;

  @IsString()
  @IsOptional()
  comment?: string;
}
