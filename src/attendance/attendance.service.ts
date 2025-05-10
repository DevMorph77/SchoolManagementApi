import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Attendance, Prisma } from '@prisma/client';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const { studentId, classId, ...rest } = createAttendanceDto;
    return this.prisma.attendance.create({
      data: {
        ...rest,
        student: {
          connect: { id: studentId }
        },
        class: {
          connect: { id: classId }
        }
      },
    });
  }

  async findAll(): Promise<Attendance[]> {
    return this.prisma.attendance.findMany({
      include: {
        student: {
          include: {
            user: true,
          },
        },
        class: true,
      },
    });
  }

  async findOne(id: number): Promise<Attendance | null> {
    return this.prisma.attendance.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        class: true,
      },
    });
  }

  async update(id: number, data: Prisma.AttendanceUpdateInput): Promise<Attendance> {
    return this.prisma.attendance.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Attendance> {
    return this.prisma.attendance.delete({
      where: { id },
    });
  }

  async findByClass(classId: number): Promise<Attendance[]> {
    return this.prisma.attendance.findMany({
      where: { classId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        class: true,
      },
    });
  }

  async findByStudent(studentId: number): Promise<Attendance[]> {
    return this.prisma.attendance.findMany({
      where: { studentId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        class: true,
      },
    });
  }
} 