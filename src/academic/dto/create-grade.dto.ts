import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({ description: 'Marks obtained in the exam' })
  @IsNumber()
  @IsNotEmpty()
  marks: number;

  @ApiProperty({ description: 'Grade (e.g., A, B, C)' })
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty({ description: 'Remarks about the grade' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({ description: 'ID of the exam' })
  @IsNumber()
  @IsNotEmpty()
  examId: number;

  @ApiProperty({ description: 'ID of the student' })
  @IsNumber()
  @IsNotEmpty()
  studentId: number;
} 