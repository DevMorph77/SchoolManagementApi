import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportTemplateDto } from './dto/create-report-template.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { Prisma, ReportType } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(
    schoolId: number,
    createdById: number,
    createReportTemplateDto: CreateReportTemplateDto
  ): Promise<Prisma.ReportTemplateGetPayload<{ include: { school: true; createdBy: true } }>> {
    return this.prisma.reportTemplate.create({
      data: {
        ...createReportTemplateDto,
        school: {
          connect: { id: schoolId }
        },
        createdBy: {
          connect: { id: createdById }
        }
      },
      include: {
        school: true,
        createdBy: true
      }
    });
  }

  async getTemplates(schoolId: number): Promise<Prisma.ReportTemplateGetPayload<{ include: { createdBy: true } }>[]> {
    return this.prisma.reportTemplate.findMany({
      where: { schoolId },
      include: {
        createdBy: true
      }
    });
  }

  async generateReport(
    schoolId: number,
    generatedById: number,
    generateReportDto: GenerateReportDto
  ): Promise<Prisma.ReportGetPayload<{ include: { template: true; school: true; generatedBy: true; student: true; class: true } }>> {
    const { templateId, studentId, classId, type, title, startDate, endDate } = generateReportDto;

    // Generate report data based on type
    const reportData = await this.generateReportData(
      type,
      schoolId,
      studentId,
      classId,
      startDate,
      endDate
    );

    return this.prisma.report.create({
      data: {
        title,
        type,
        data: JSON.stringify(reportData),
        school: {
          connect: { id: schoolId }
        },
        generatedBy: {
          connect: { id: generatedById }
        },
        ...(templateId && {
          template: {
            connect: { id: templateId }
          }
        }),
        ...(studentId && {
          student: {
            connect: { id: studentId }
          }
        }),
        ...(classId && {
          class: {
            connect: { id: classId }
          }
        })
      },
      include: {
        template: true,
        school: true,
        generatedBy: true,
        student: true,
        class: true
      }
    });
  }

  private async generateReportData(
    type: ReportType,
    schoolId: number,
    studentId?: number,
    classId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    switch (type) {
      case ReportType.ACADEMIC_PROGRESS:
        if (!studentId) throw new NotFoundException('Student ID is required for academic progress report');
        return this.generateAcademicProgressReport(studentId, start, end);
      case ReportType.ATTENDANCE_SUMMARY:
        if (!studentId && !classId) throw new NotFoundException('Either Student ID or Class ID is required for attendance summary report');
        return this.generateAttendanceSummaryReport(studentId, classId, start, end);
      case ReportType.CLASS_PERFORMANCE:
        if (!classId) throw new NotFoundException('Class ID is required for class performance report');
        return this.generateClassPerformanceReport(classId, start, end);
      case ReportType.EXAM_RESULTS:
        if (!studentId && !classId) throw new NotFoundException('Either Student ID or Class ID is required for exam results report');
        return this.generateExamResultsReport(studentId, classId, start, end);
      default:
        return {};
    }
  }

  private async generateAcademicProgressReport(
    studentId: number,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const grades = await this.prisma.grade.findMany({
      where: {
        studentId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        exam: {
          include: {
            course: {
              include: {
                subject: true
              }
            }
          }
        },
        student: {
          include: {
            user: true
          }
        }
      }
    });

    return {
      studentGrades: grades.map(grade => ({
        id: grade.id,
        marks: grade.marks,
        grade: grade.grade,
        remarks: grade.remarks,
        examName: grade.exam.name,
        subject: grade.exam.course.subject.name,
        totalMarks: grade.exam.totalMarks
      })),
      averageGrade: grades.reduce((acc, grade) => acc + Number(grade.grade), 0) / grades.length,
      totalExams: grades.length
    };
  }

  private async generateAttendanceSummaryReport(
    studentId: number | undefined,
    classId: number | undefined,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const whereClause: Prisma.AttendanceWhereInput = {
      ...(studentId && { studentId }),
      ...(classId && { classId }),
      date: {
        gte: startDate,
        lte: endDate
      }
    };

    const attendance = await this.prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: true
          }
        },
        class: true
      }
    });

    return {
      totalDays: attendance.length,
      presentDays: attendance.filter(a => a.status === 'PRESENT').length,
      absentDays: attendance.filter(a => a.status === 'ABSENT').length,
      lateDays: attendance.filter(a => a.status === 'LATE').length,
      attendanceRecords: attendance.map(record => ({
        id: record.id,
        date: record.date,
        status: record.status,
        studentName: record.student.user.firstName + ' ' + record.student.user.lastName,
        className: record.class.name
      }))
    };
  }

  private async generateClassPerformanceReport(
    classId: number,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const students = await this.prisma.student.findMany({
      where: { classId },
      include: {
        grades: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          include: {
            exam: true
          }
        },
        user: true
      }
    });

    return {
      totalStudents: students.length,
      averageClassGrade: students.reduce((acc, student) => {
        const studentAvg = student.grades.reduce((sum, grade) => sum + Number(grade.grade), 0) / 
          (student.grades.length || 1);
        return acc + studentAvg;
      }, 0) / students.length,
      studentPerformance: students.map(student => ({
        studentId: student.id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        averageGrade: student.grades.reduce((acc, grade) => acc + Number(grade.grade), 0) / 
          (student.grades.length || 1),
        totalExams: student.grades.length
      }))
    };
  }

  private async generateExamResultsReport(
    studentId: number | undefined,
    classId: number | undefined,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const whereClause: Prisma.GradeWhereInput = {
      ...(studentId && { studentId }),
      exam: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    };

    const grades = await this.prisma.grade.findMany({
      where: whereClause,
      include: {
        exam: {
          include: {
            course: true
          }
        },
        student: {
          include: {
            user: true
          }
        }
      }
    });

    return {
      totalExams: grades.length,
      examResults: grades.map(grade => ({
        id: grade.id,
        marks: grade.marks,
        grade: grade.grade,
        remarks: grade.remarks,
        studentName: `${grade.student.user.firstName} ${grade.student.user.lastName}`,
        examName: grade.exam.name,
        subject: grade.exam.course.name,
        totalMarks: grade.exam.totalMarks
      }))
    };
  }

  async getReports(
    schoolId: number,
    type?: ReportType,
    studentId?: number,
    classId?: number
  ): Promise<Prisma.ReportGetPayload<{ include: { template: true; school: true; generatedBy: true; student: true; class: true } }>[]> {
    return this.prisma.report.findMany({
      where: {
        schoolId,
        ...(type && { type }),
        ...(studentId && { studentId }),
        ...(classId && { classId })
      },
      include: {
        template: true,
        school: true,
        generatedBy: true,
        student: true,
        class: true
      }
    });
  }

  async getReportById(id: number): Promise<Prisma.ReportGetPayload<{ include: { template: true; school: true; generatedBy: true; student: true; class: true } }>> {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        template: true,
        school: true,
        generatedBy: true,
        student: true,
        class: true
      }
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async updateTemplate(id: number, updateDto: any) {
    return this.prisma.reportTemplate.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteTemplate(id: number) {
    return this.prisma.reportTemplate.delete({ where: { id } });
  }

  async updateReport(id: number, updateDto: any) {
    return this.prisma.report.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteReport(id: number) {
    return this.prisma.report.delete({ where: { id } });
  }
} 