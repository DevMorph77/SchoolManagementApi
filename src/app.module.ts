import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchoolModule } from './school/school.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AcademicModule } from './academic/academic.module';
import { StudentModule } from './student/student.module';
import { NotificationModule } from './notification/notification.module';
import { EventModule } from './event/event.module';
import { ReportModule } from './report/report.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    SchoolModule,
    AttendanceModule,
    AcademicModule,
    StudentModule,
    NotificationModule,
    EventModule,
    ReportModule,
    AdminModule,
  ],
})
export class AppModule {} 