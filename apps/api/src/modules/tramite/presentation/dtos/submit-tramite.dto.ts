import { IsInt, IsNotEmpty, IsString, IsUrl, Min } from 'class-validator';

export class SubmitTramiteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  extractedText: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsUrl()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsInt()
  @Min(1)
  sizeBytes: number;
}
