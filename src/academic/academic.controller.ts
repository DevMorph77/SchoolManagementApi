import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateGradeDto } from './dto/create-grade.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('academic')
@Controller('academic')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  // Course endpoints
  @Post('courses')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'The course has been successfully created.' })
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.academicService.createCourse(createCourseDto);
  }

  @Get('courses')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all courses' })
  findAllCourses() {
    return this.academicService.findAllCourses();
  }

  @Get('courses/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get a course by ID' })
  findCourseById(@Param('id') id: string) {
    return this.academicService.findCourseById(+id);
  }

  // Course update/delete
  @Patch('courses/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a course' })
  updateCourse(@Param('id') id: string, @Body() data: any) {
    return this.academicService.updateCourse(+id, data);
  }

  @Delete('courses/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a course' })
  deleteCourse(@Param('id') id: string) {
    return this.academicService.deleteCourse(+id);
  }

  // Subject endpoints
  @Post('subjects')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiResponse({ status: 201, description: 'The subject has been successfully created.' })
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.academicService.createSubject(createSubjectDto);
  }

  @Get('subjects')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all subjects' })
  findAllSubjects() {
    return this.academicService.findAllSubjects();
  }

  @Get('subjects/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get a subject by ID' })
  findSubjectById(@Param('id') id: string) {
    return this.academicService.findSubjectById(+id);
  }

  // Subject update/delete
  @Patch('subjects/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a subject' })
  updateSubject(@Param('id') id: string, @Body() data: any) {
    return this.academicService.updateSubject(+id, data);
  }

  @Delete('subjects/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a subject' })
  deleteSubject(@Param('id') id: string) {
    return this.academicService.deleteSubject(+id);
  }

  // Exam endpoints
  @Post('exams')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new exam' })
  @ApiResponse({ status: 201, description: 'The exam has been successfully created.' })
  createExam(@Body() createExamDto: CreateExamDto) {
    return this.academicService.createExam(createExamDto);
  }

  @Get('exams')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all exams' })
  findAllExams() {
    return this.academicService.findAllExams();
  }

  @Get('exams/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get an exam by ID' })
  findExamById(@Param('id') id: string) {
    return this.academicService.findExamById(+id);
  }

  // Exam update/delete
  @Patch('exams/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update an exam' })
  updateExam(@Param('id') id: string, @Body() data: any) {
    return this.academicService.updateExam(+id, data);
  }

  @Delete('exams/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete an exam' })
  deleteExam(@Param('id') id: string) {
    return this.academicService.deleteExam(+id);
  }

  // Grade endpoints
  @Post('grades')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new grade' })
  @ApiResponse({ status: 201, description: 'The grade has been successfully created.' })
  createGrade(@Body() createGradeDto: CreateGradeDto) {
    return this.academicService.createGrade(createGradeDto);
  }

  @Get('grades/student/:studentId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all grades for a student' })
  findGradesByStudent(@Param('studentId') studentId: string) {
    return this.academicService.findGradesByStudent(+studentId);
  }

  @Get('grades/exam/:examId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all grades for an exam' })
  findGradesByExam(@Param('examId') examId: string) {
    return this.academicService.findGradesByExam(+examId);
  }

  // Grade update/delete
  @Patch('grades/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a grade' })
  updateGrade(@Param('id') id: string, @Body() data: any) {
    return this.academicService.updateGrade(+id, data);
  }

  @Delete('grades/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete a grade' })
  deleteGrade(@Param('id') id: string) {
    return this.academicService.deleteGrade(+id);
  }
} 