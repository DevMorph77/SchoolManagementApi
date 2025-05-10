import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class CreateStudentProfileDto {
  @ApiProperty({ description: 'Date of birth of the student' })
  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({ description: 'Gender of the student' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ description: 'Blood group of the student', required: false })
  @IsString()
  @IsOptional()
  bloodGroup?: string;

  @ApiProperty({ description: 'Any allergies the student has', required: false })
  @IsString()
  @IsOptional()
  allergies?: string;

  @ApiProperty({ description: 'Medical notes about the student', required: false })
  @IsString()
  @IsOptional()
  medicalNotes?: string;

  @ApiProperty({ description: 'Emergency contact number' })
  @IsString()
  @IsNotEmpty()
  emergencyContact: string;

  @ApiProperty({ description: 'IDs of the guardians', type: [Number] })
  @IsNotEmpty()
  guardianIds: number[];
} 