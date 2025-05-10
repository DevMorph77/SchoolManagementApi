import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsArray, IsNumber, IsOptional, IsObject } from 'class-validator';
import { NotificationType, NotificationPriority } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Title of the notification' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Message content of the notification' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ enum: NotificationType, description: 'Type of notification' })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({ enum: NotificationPriority, description: 'Priority of the notification' })
  @IsEnum(NotificationPriority)
  @IsNotEmpty()
  priority: NotificationPriority;

  @ApiProperty({ description: 'Additional data in JSON format', required: false })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @ApiProperty({ description: 'IDs of the recipients', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  recipientIds: number[];
} 