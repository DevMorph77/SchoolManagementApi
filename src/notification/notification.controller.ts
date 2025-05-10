import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role, NotificationType } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
    role: Role;
  };
}

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'The notification has been successfully created.' })
  createNotification(
    @Req() req: RequestWithUser,
    @Body() createNotificationDto: CreateNotificationDto
  ) {
    return this.notificationService.createNotification(req.user.id, createNotificationDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  getNotifications(@Req() req: RequestWithUser) {
    return this.notificationService.getNotificationsForUser(req.user.id);
  }

  @Get('unread/count')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get count of unread notifications' })
  getUnreadCount(@Req() req: RequestWithUser) {
    return this.notificationService.getUnreadCount(req.user.id);
  }

  @Get('type/:type')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get notifications by type' })
  getNotificationsByType(
    @Req() req: RequestWithUser,
    @Param('type') type: NotificationType
  ) {
    return this.notificationService.getNotificationsByType(req.user.id, type);
  }

  @Post(':id/read')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'The notification has been marked as read.' })
  markAsRead(
    @Req() req: RequestWithUser,
    @Param('id') id: string
  ) {
    return this.notificationService.markAsRead(+id, req.user.id);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 200, description: 'The notification has been deleted.' })
  deleteNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string
  ) {
    return this.notificationService.deleteNotification(+id, req.user.id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({ status: 200, description: 'The notification has been updated.' })
  updateNotification(
    @Param('id') id: string,
    @Body() updateDto: any
  ) {
    return this.notificationService.updateNotification(+id, updateDto);
  }
} 