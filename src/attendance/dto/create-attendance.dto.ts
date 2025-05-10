import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  classId: number;
} 