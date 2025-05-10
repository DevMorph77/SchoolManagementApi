import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateExamDto {
  @ApiProperty({ description: 'Name of the exam' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Date of the exam' })
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ description: 'Total marks for the exam' })
  @IsNumber()
  @IsNotEmpty()
  totalMarks: number;

  @ApiProperty({ description: 'Description of the exam' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID of the course this exam belongs to' })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;
} 