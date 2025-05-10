import { Controller, Get, Post, Body, Param, Put, UseGuards, Patch, Delete, Res, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';
import * as crypto from 'crypto';
import { Response } from 'express';
import { Parser as CsvParser } from 'json2csv';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csvParse from 'csv-parse/sync';

@ApiTags('student')
@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // Guardian endpoints
  @Post('guardians')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new guardian' })
  @ApiResponse({ status: 201, description: 'The guardian has been successfully created.' })
  createGuardian(@Body() createGuardianDto: CreateGuardianDto) {
    return this.studentService.createGuardian(createGuardianDto);
  }

  @Get('guardians')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all guardians' })
  findAllGuardians() {
    return this.studentService.findAllGuardians();
  }

  @Get('guardians/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get a guardian by ID' })
  findGuardianById(@Param('id') id: string) {
    return this.studentService.findGuardianById(+id);
  }

  // Student Profile endpoints
  @Post('profiles/:studentId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a student profile' })
  @ApiResponse({ status: 201, description: 'The student profile has been successfully created.' })
  createStudentProfile(
    @Param('studentId') studentId: string,
    @Body() createStudentProfileDto: CreateStudentProfileDto
  ) {
    return this.studentService.createStudentProfile(+studentId, createStudentProfileDto);
  }

  @Get('profiles/:studentId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get a student profile' })
  findStudentProfile(@Param('studentId') studentId: string) {
    return this.studentService.findStudentProfile(+studentId);
  }

  @Put('profiles/:studentId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a student profile' })
  @ApiResponse({ status: 200, description: 'The student profile has been successfully updated.' })
  updateStudentProfile(
    @Param('studentId') studentId: string,
    @Body() updateStudentProfileDto: CreateStudentProfileDto
  ) {
    return this.studentService.updateStudentProfile(+studentId, updateStudentProfileDto);
  }

  // Student CRUD endpoints
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Get all students' })
  findAllStudents() {
    return this.studentService.findAllStudents();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Get a student by ID' })
  findStudentById(@Param('id') id: string) {
    return this.studentService.findStudentById(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a student (assign class, etc.)' })
  updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: any
  ) {
    return this.studentService.updateStudent(+id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a student' })
  deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(+id);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new student (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        schoolId: { type: 'number' },
        classId: { type: 'number', nullable: true },
      },
      required: ['email', 'firstName', 'lastName', 'schoolId']
    }
  })
  async createStudent(@Body() body: any) {
    // Generate a random password for the student
    const password = crypto.randomBytes(8).toString('hex');
    return this.studentService.createStudent({ ...body, password });
  }

  @Get('export')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Export all students as CSV or JSON' })
  async exportStudents(@Res() res: Response, @Query('format') format: string = 'csv') {
    const students = await this.studentService.findAllStudents();
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=students.json');
      return res.send(students);
    } else {
      // Flatten for CSV
      const flat = students.map(s => ({
        id: s.id,
        email: s.user?.email,
        firstName: s.user?.firstName,
        lastName: s.user?.lastName,
        schoolId: s.schoolId,
        classId: s.classId
      }));
      const csv = new CsvParser({ fields: Object.keys(flat[0] || {}) }).parse(flat);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
      return res.send(csv);
    }
  }

  @Post('import')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Bulk import students from CSV or JSON' })
  async importStudents(@UploadedFile() file: Express.Multer.File) {
    const content = file.buffer.toString();
    let students;
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      students = JSON.parse(content);
    } else {
      students = csvParse.parse(content, { columns: true });
    }
    return this.studentService.bulkCreateStudents(students);
  }
} 