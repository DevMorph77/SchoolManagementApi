import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsJSON } from 'class-validator';
import { Prisma } from '@prisma/client';
import { ReportType } from '@prisma/client';

export class CreateReportTemplateDto {
  @ApiProperty({ description: 'Name of the report template' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ReportType, description: 'Type of report' })
  @IsNotEmpty()
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ description: 'JSON schema defining the report structure' })
  @IsNotEmpty()
  @IsString()
  format: string;
} 