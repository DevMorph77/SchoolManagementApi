import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification, NotificationRecipient, NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    senderId: number,
    createNotificationDto: CreateNotificationDto
  ): Promise<Notification> {
    const { recipientIds, ...notificationData } = createNotificationDto;
    
    return this.prisma.notification.create({
      data: {
        ...notificationData,
        sender: {
          connect: { id: senderId }
        },
        recipients: {
          create: recipientIds.map(recipientId => ({
            recipient: {
              connect: { id: recipientId }
            }
          }))
        }
      },
      include: {
        sender: true,
        recipients: {
          include: {
            recipient: true
          }
        }
      }
    });
  }

  async getNotificationsForUser(userId: number): Promise<NotificationRecipient[]> {
    return this.prisma.notificationRecipient.findMany({
      where: { recipientId: userId },
      include: {
        notification: {
          include: {
            sender: true
          }
        }
      },
      orderBy: {
        notification: {
          createdAt: 'desc'
        }
      }
    });
  }

  async markAsRead(notificationId: number, userId: number): Promise<NotificationRecipient> {
    return this.prisma.notificationRecipient.update({
      where: {
        notificationId_recipientId: {
          notificationId,
          recipientId: userId
        }
      },
      data: {
        isRead: true,
        readAt: new Date()
      },
      include: {
        notification: true
      }
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.prisma.notificationRecipient.count({
      where: {
        recipientId: userId,
        isRead: false
      }
    });
  }

  async getNotificationsByType(
    userId: number,
    type: NotificationType
  ): Promise<NotificationRecipient[]> {
    return this.prisma.notificationRecipient.findMany({
      where: {
        recipientId: userId,
        notification: {
          type
        }
      },
      include: {
        notification: {
          include: {
            sender: true
          }
        }
      },
      orderBy: {
        notification: {
          createdAt: 'desc'
        }
      }
    });
  }

  async deleteNotification(notificationId: number, userId: number): Promise<void> {
    await this.prisma.notificationRecipient.delete({
      where: {
        notificationId_recipientId: {
          notificationId,
          recipientId: userId
        }
      }
    });
  }

  async updateNotification(id: number, updateDto: any) {
    // Only allow updating message, type, priority, data
    return this.prisma.notification.update({
      where: { id },
      data: {
        message: updateDto.message,
        type: updateDto.type,
        priority: updateDto.priority,
        data: updateDto.data,
      },
    });
  }
} 