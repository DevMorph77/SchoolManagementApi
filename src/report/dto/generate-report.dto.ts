import { ReportType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GenerateReportDto {
  @IsOptional()
  @IsNumber()
  templateId?: number;

  @IsOptional()
  @IsNumber()
  studentId?: number;

  @IsOptional()
  @IsNumber()
  classId?: number;

  @IsNotEmpty()
  @IsEnum(ReportType)
  type: ReportType;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
} 