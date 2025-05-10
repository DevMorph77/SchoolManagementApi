import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { Guardian, StudentProfile, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { User, Student } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  // Guardian operations
  async createGuardian(createGuardianDto: CreateGuardianDto): Promise<Guardian> {
    return this.prisma.guardian.create({
      data: createGuardianDto
    });
  }

  async findAllGuardians(): Promise<Guardian[]> {
    return this.prisma.guardian.findMany({
      include: {
        students: {
          include: {
            student: true
          }
        }
      }
    });
  }

  async findGuardianById(id: number): Promise<Guardian | null> {
    return this.prisma.guardian.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            student: true
          }
        }
      }
    });
  }

  // Student Profile operations
  async createStudentProfile(
    studentId: number,
    createStudentProfileDto: CreateStudentProfileDto
  ): Promise<StudentProfile> {
    const { guardianIds, ...profileData } = createStudentProfileDto;
    return this.prisma.studentProfile.create({
      data: {
        ...profileData,
        student: {
          connect: { id: studentId }
        },
        guardians: {
          connect: guardianIds.map(id => ({ id }))
        }
      },
      include: {
        student: true,
        guardians: true
      }
    });
  }

  async findStudentProfile(studentId: number): Promise<StudentProfile | null> {
    return this.prisma.studentProfile.findUnique({
      where: { studentId },
      include: {
        student: true,
        guardians: true
      }
    });
  }

  async updateStudentProfile(
    studentId: number,
    updateStudentProfileDto: Partial<CreateStudentProfileDto>
  ): Promise<StudentProfile> {
    const { guardianIds, ...profileData } = updateStudentProfileDto;
    return this.prisma.studentProfile.update({
      where: { studentId },
      data: {
        ...profileData,
        guardians: guardianIds ? {
          set: guardianIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        student: true,
        guardians: true
      }
    });
  }

  // Student CRUD operations
  async findAllStudents() {
    return this.prisma.student.findMany({
      include: { user: true, class: true, profile: true }
    });
  }

  async findStudentById(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
      include: { user: true, class: true, profile: true }
    });
  }

  async updateStudent(id: number, updateStudentDto: any) {
    // Allow updating classId and other fields as needed
    return this.prisma.student.update({
      where: { id },
      data: updateStudentDto,
      include: { user: true, class: true, profile: true }
    });
  }

  async deleteStudent(id: number) {
    return this.prisma.student.delete({
      where: { id }
    });
  }

  async createStudent(data: { email: string; firstName: string; lastName: string; schoolId: number; classId?: number; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // Create user and student in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'STUDENT',
          schoolId: data.schoolId,
        },
      });
      const student = await prisma.student.create({
        data: {
          userId: user.id,
          schoolId: data.schoolId,
          classId: data.classId,
        },
        include: { user: true, class: true, profile: true }
      });
      return { user: { ...user, password: data.password }, student };
    });
    return result;
  }

  async bulkCreateStudents(students: Array<{ email: string; firstName: string; lastName: string; schoolId: number; classId?: number }>) {
    const results: any[] = [];
    for (const s of students) {
      const password = crypto.randomBytes(8).toString('hex');
      try {
        const created = await this.createStudent({ ...s, password });
        results.push({ email: s.email, password, status: 'created', id: created.student.id });
      } catch (e) {
        results.push({ email: s.email, error: e.message, status: 'failed' });
      }
    }
    return results;
  }
} 