import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { School, Prisma } from '@prisma/client';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('schools')
@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new school (Super Admin and Admin only)' })
  @ApiResponse({ status: 201, description: 'The school has been successfully created.' })
  create(@Body() createSchoolDto: CreateSchoolDto): Promise<School> {
    return this.schoolService.create(createSchoolDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all schools (Super Admin, Admin and Teacher)' })
  findAll(): Promise<School[]> {
    return this.schoolService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get a school by id (Super Admin, Admin and Teacher)' })
  findOne(@Param('id') id: string): Promise<School | null> {
    return this.schoolService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a school (Super Admin and Admin only)' })
  update(
    @Param('id') id: string,
    @Body() updateSchoolDto: Prisma.SchoolUpdateInput,
  ): Promise<School> {
    return this.schoolService.update(+id, updateSchoolDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a school (Super Admin and Admin only)' })
  remove(@Param('id') id: string): Promise<School> {
    return this.schoolService.remove(+id);
  }
} 