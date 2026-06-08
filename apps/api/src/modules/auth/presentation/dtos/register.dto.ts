import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsIn(['CITIZEN', 'SECRETARY'])
  @IsOptional()
  role?: 'CITIZEN' | 'SECRETARY';

  @IsString()
  @IsOptional()
  departmentId?: string;
}
