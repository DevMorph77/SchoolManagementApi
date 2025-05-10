import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Put, NotFoundException, Patch } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role, EventStatus, EventType } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
    role: Role;
  };
}

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
  createEvent(
    @Req() req: RequestWithUser,
    @Body() createEventDto: CreateEventDto
  ) {
    return this.eventService.createEvent(req.user.id, createEventDto);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'The event has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async getEventById(@Param('id') id: string) {
    try {
      return await this.eventService.getEventById(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }

  @Get('school/:schoolId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all events for a school' })
  getEventsBySchool(@Param('schoolId') schoolId: string) {
    return this.eventService.getEventsBySchool(+schoolId);
  }

  @Get('school/:schoolId/type/:type')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get events by type for a school' })
  getEventsByType(
    @Param('schoolId') schoolId: string,
    @Param('type') type: EventType
  ) {
    return this.eventService.getEventsByType(+schoolId, type);
  }

  @Get('school/:schoolId/upcoming')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get upcoming events for a school' })
  getUpcomingEvents(@Param('schoolId') schoolId: string) {
    return this.eventService.getUpcomingEvents(+schoolId);
  }

  @Put(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update event status' })
  updateEventStatus(
    @Param('id') id: string,
    @Body('status') status: EventStatus
  ) {
    return this.eventService.updateEventStatus(+id, status);
  }

  @Post(':id/participants')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Add a participant to an event' })
  addParticipant(
    @Param('id') id: string,
    @Body('userId') userId: number,
    @Body('role') role: string
  ) {
    return this.eventService.addParticipant(+id, userId, role);
  }

  @Delete(':id/participants/:userId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Remove a participant from an event' })
  removeParticipant(
    @Param('id') id: string,
    @Param('userId') userId: string
  ) {
    return this.eventService.removeParticipant(+id, +userId);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Delete an event' })
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update event details' })
  updateEvent(
    @Param('id') id: string,
    @Body() updateDto: any
  ) {
    return this.eventService.updateEvent(+id, updateDto);
  }
} 