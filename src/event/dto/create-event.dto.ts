import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsDate, IsOptional, IsNumber } from 'class-validator';
import { EventType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({ description: 'Title of the event' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the event', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: EventType, description: 'Type of the event' })
  @IsEnum(EventType)
  @IsNotEmpty()
  type: EventType;

  @ApiProperty({ description: 'Start date and time of the event' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ description: 'End date and time of the event' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ description: 'Location of the event', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'ID of the school organizing the event' })
  @IsNumber()
  @IsNotEmpty()
  schoolId: number;
} 