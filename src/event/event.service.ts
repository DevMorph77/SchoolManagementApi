import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventParticipant, EventStatus, EventType } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(organizerId: number, createEventDto: CreateEventDto): Promise<Event> {
    const { schoolId, ...eventData } = createEventDto;
    
    return this.prisma.event.create({
      data: {
        ...eventData,
        organizer: {
          connect: { id: organizerId }
        },
        school: {
          connect: { id: schoolId }
        },
        participants: {
          create: {
            user: {
              connect: { id: organizerId }
            },
            role: 'ORGANIZER'
          }
        }
      },
      include: {
        organizer: true,
        school: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    });
  }

  async getEventById(id: number): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
        school: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async getEventsBySchool(schoolId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { schoolId },
      include: {
        organizer: true,
        school: true,
        participants: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    });
  }

  async getEventsByType(schoolId: number, type: EventType): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        schoolId,
        type
      },
      include: {
        organizer: true,
        school: true,
        participants: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    });
  }

  async updateEventStatus(id: number, status: EventStatus): Promise<Event> {
    return this.prisma.event.update({
      where: { id },
      data: { status },
      include: {
        organizer: true,
        school: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    });
  }

  async addParticipant(eventId: number, userId: number, role: string): Promise<EventParticipant> {
    return this.prisma.eventParticipant.create({
      data: {
        event: {
          connect: { id: eventId }
        },
        user: {
          connect: { id: userId }
        },
        role
      },
      include: {
        event: true,
        user: true
      }
    });
  }

  async removeParticipant(eventId: number, userId: number): Promise<void> {
    await this.prisma.eventParticipant.delete({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      }
    });
  }

  async getUpcomingEvents(schoolId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        schoolId,
        startDate: {
          gt: new Date()
        },
        status: EventStatus.PLANNED
      },
      include: {
        organizer: true,
        school: true,
        participants: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    });
  }

  async deleteEvent(id: number): Promise<void> {
    await this.prisma.event.delete({
      where: { id }
    });
  }

  async updateEvent(id: number, updateDto: any) {
    // Allow updating general event fields
    return this.prisma.event.update({
      where: { id },
      data: {
        title: updateDto.title,
        description: updateDto.description,
        type: updateDto.type,
        status: updateDto.status,
        startDate: updateDto.startDate,
        endDate: updateDto.endDate,
        location: updateDto.location,
      },
    });
  }
} 