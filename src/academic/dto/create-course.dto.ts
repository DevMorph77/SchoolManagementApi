import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: 'Name of the course' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Course code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Description of the course' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Credit hours for the course' })
  @IsNumber()
  @IsNotEmpty()
  creditHours: number;

  @ApiProperty({ description: 'ID of the subject this course belongs to' })
  @IsNumber()
  @IsNotEmpty()
  subjectId: number;
} 