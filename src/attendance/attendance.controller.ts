import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Attendance, Prisma } from '@prisma/client';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create attendance record' })
  @ApiResponse({ status: 201, description: 'The attendance record has been successfully created.' })
  create(@Body() createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all attendance records' })
  findAll(): Promise<Attendance[]> {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get attendance record by id' })
  findOne(@Param('id') id: string): Promise<Attendance | null> {
    return this.attendanceService.findOne(+id);
  }

  @Get('class/:classId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get attendance records by class' })
  findByClass(@Param('classId') classId: string): Promise<Attendance[]> {
    return this.attendanceService.findByClass(+classId);
  }

  @Get('student/:studentId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get attendance records by student' })
  findByStudent(@Param('studentId') studentId: string): Promise<Attendance[]> {
    return this.attendanceService.findByStudent(+studentId);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update attendance record' })
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: Prisma.AttendanceUpdateInput,
  ): Promise<Attendance> {
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Delete attendance record' })
  remove(@Param('id') id: string): Promise<Attendance> {
    return this.attendanceService.remove(+id);
  }
} 