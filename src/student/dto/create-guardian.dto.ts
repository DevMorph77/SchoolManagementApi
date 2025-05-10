import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateGuardianDto {
  @ApiProperty({ description: 'First name of the guardian' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of the guardian' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email address of the guardian' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number of the guardian' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Relationship to the student (e.g., Father, Mother, Guardian)' })
  @IsString()
  @IsNotEmpty()
  relationship: string;

  @ApiProperty({ description: 'Address of the guardian', required: false })
  @IsString()
  @IsOptional()
  address?: string;
} 