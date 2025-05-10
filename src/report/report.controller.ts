import { Controller, Get, Post, Body, Param, Query, UseGuards, Req, Patch, Delete } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportTemplateDto } from './dto/create-report-template.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role, ReportType, Prisma } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
    role: Role;
  };
}

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('templates')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new report template' })
  @ApiResponse({ status: 201, description: 'The report template has been successfully created.' })
  createTemplate(
    @Req() req: RequestWithUser,
    @Body() createReportTemplateDto: CreateReportTemplateDto,
    @Param('schoolId') schoolId: number
  ) {
    return this.reportService.createTemplate(schoolId, req.user.id, createReportTemplateDto);
  }

  @Get('templates')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all report templates for a school' })
  getTemplates(@Param('schoolId') schoolId: number) {
    return this.reportService.getTemplates(schoolId);
  }

  @Post('generate')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Generate a new report' })
  @ApiResponse({ status: 201, description: 'The report has been successfully generated.' })
  generateReport(
    @Req() req: RequestWithUser,
    @Body() generateReportDto: GenerateReportDto,
    @Param('schoolId') schoolId: number
  ) {
    return this.reportService.generateReport(schoolId, req.user.id, generateReportDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get reports with optional filters' })
  getReports(
    @Param('schoolId') schoolId: number,
    @Param('type') type?: ReportType,
    @Param('studentId') studentId?: number,
    @Param('classId') classId?: number
  ) {
    return this.reportService.getReports(schoolId, type, studentId, classId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a specific report by ID' })
  @ApiResponse({ status: 200, description: 'Returns the report details.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  getReportById(@Param('id') id: number) {
    return this.reportService.getReportById(id);
  }

  @Patch('templates/:id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a report template' })
  updateTemplate(@Param('id') id: string, @Body() updateDto: any) {
    return this.reportService.updateTemplate(+id, updateDto);
  }

  @Delete('templates/:id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete a report template' })
  deleteTemplate(@Param('id') id: string) {
    return this.reportService.deleteTemplate(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a report' })
  updateReport(@Param('id') id: string, @Body() updateDto: any) {
    return this.reportService.updateReport(+id, updateDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete a report' })
  deleteReport(@Param('id') id: string) {
    return this.reportService.deleteReport(+id);
  }
} 