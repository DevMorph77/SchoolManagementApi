import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  schoolId?: number;
} 