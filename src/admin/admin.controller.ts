import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';
import { AdminService } from './admin.service';
import * as crypto from 'crypto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all admins' })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get an admin by ID' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        schoolId: { type: 'number' }
      },
      required: ['email', 'firstName', 'lastName', 'schoolId']
    }
  })
  async create(@Body() body: any) {
    const password = crypto.randomBytes(8).toString('hex');
    return this.adminService.create({ ...body, password });
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an admin' })
  update(@Param('id') id: string, @Body() updateAdminDto: any) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an admin' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
} 