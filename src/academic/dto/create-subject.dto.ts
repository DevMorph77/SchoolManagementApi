import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({ description: 'Name of the subject' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Subject code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Description of the subject' })
  @IsString()
  @IsOptional()
  description?: string;
} 