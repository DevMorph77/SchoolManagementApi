import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateGradeDto } from './dto/create-grade.dto';
import { Course, Subject, Exam, Grade, Prisma } from '@prisma/client';

@Injectable()
export class AcademicService {
  constructor(private prisma: PrismaService) {}

  // Course operations
  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const { subjectId, ...courseData } = createCourseDto;
    return this.prisma.course.create({
      data: {
        ...courseData,
        subject: {
          connect: { id: subjectId }
        }
      },
      include: {
        subject: true
      }
    });
  }

  async findAllCourses(): Promise<Course[]> {
    return this.prisma.course.findMany({
      include: {
        subject: true
      }
    });
  }

  async findCourseById(id: number): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        subject: true
      }
    });
  }

  // Subject operations
  async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.prisma.subject.create({
      data: createSubjectDto
    });
  }

  async findAllSubjects(): Promise<Subject[]> {
    return this.prisma.subject.findMany();
  }

  async findSubjectById(id: number): Promise<Subject | null> {
    return this.prisma.subject.findUnique({
      where: { id },
      include: {
        courses: true
      }
    });
  }

  // Exam operations
  async createExam(createExamDto: CreateExamDto): Promise<Exam> {
    const { courseId, ...examData } = createExamDto;
    return this.prisma.exam.create({
      data: {
        ...examData,
        course: {
          connect: { id: courseId }
        }
      },
      include: {
        course: true,
        grades: true
      }
    });
  }

  async findAllExams(): Promise<Exam[]> {
    return this.prisma.exam.findMany({
      include: {
        course: true,
        grades: true
      }
    });
  }

  async findExamById(id: number): Promise<Exam | null> {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        course: true,
        grades: {
          include: {
            student: true
          }
        }
      }
    });
  }

  // Grade operations
  async createGrade(createGradeDto: CreateGradeDto): Promise<Grade> {
    const { examId, studentId, ...gradeData } = createGradeDto;
    return this.prisma.grade.create({
      data: {
        ...gradeData,
        exam: {
          connect: { id: examId }
        },
        student: {
          connect: { id: studentId }
        }
      },
      include: {
        exam: true,
        student: true
      }
    });
  }

  async findGradesByStudent(studentId: number): Promise<Grade[]> {
    return this.prisma.grade.findMany({
      where: { studentId },
      include: {
        exam: {
          include: {
            course: true
          }
        }
      }
    });
  }

  async findGradesByExam(examId: number): Promise<Grade[]> {
    return this.prisma.grade.findMany({
      where: { examId },
      include: {
        student: true
      }
    });
  }

  // Update and delete for Course
  async updateCourse(id: number, data: Partial<Course>): Promise<Course> {
    return this.prisma.course.update({ where: { id }, data, include: { subject: true } });
  }

  async deleteCourse(id: number): Promise<Course> {
    return this.prisma.course.delete({ where: { id } });
  }

  // Update and delete for Subject
  async updateSubject(id: number, data: Partial<Subject>): Promise<Subject> {
    return this.prisma.subject.update({ where: { id }, data });
  }

  async deleteSubject(id: number): Promise<Subject> {
    return this.prisma.subject.delete({ where: { id } });
  }

  // Update and delete for Exam
  async updateExam(id: number, data: Partial<Exam>): Promise<Exam> {
    return this.prisma.exam.update({ where: { id }, data, include: { course: true, grades: true } });
  }

  async deleteExam(id: number): Promise<Exam> {
    return this.prisma.exam.delete({ where: { id } });
  }

  // Update and delete for Grade
  async updateGrade(id: number, data: Partial<Grade>): Promise<Grade> {
    return this.prisma.grade.update({ where: { id }, data, include: { exam: true, student: true } });
  }

  async deleteGrade(id: number): Promise<Grade> {
    return this.prisma.grade.delete({ where: { id } });
  }
} 