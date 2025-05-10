import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { addMinutes } from 'date-fns';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    schoolId?: number;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // If schoolId is provided, verify the school exists
    if (data.schoolId) {
      const school = await this.prisma.school.findUnique({
        where: { id: data.schoolId },
      });
      if (!school) {
        throw new BadRequestException('School not found');
      }
    }

    // Create user with Prisma transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          schoolId: data.schoolId,
        },
      });

      // Create role-specific record based on user role
      if (data.role === Role.TEACHER && data.schoolId) {
        await prisma.teacher.create({
          data: {
            userId: user.id,
            schoolId: data.schoolId,
          },
        });
      } else if (data.role === Role.STUDENT && data.schoolId) {
        await prisma.student.create({
          data: {
            userId: user.id,
            schoolId: data.schoolId,
          },
        });
      } else if (data.role === Role.ADMIN && data.schoolId) {
        await prisma.admin.create({
          data: {
            userId: user.id,
            schoolId: data.schoolId,
          },
        });
      }

      return user;
    });

    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    const token = randomBytes(32).toString('hex');
    const expires = addMinutes(new Date(), 30); // Token valid for 30 minutes
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
    return token;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gte: new Date() },
      },
    });
    if (!user) throw new BadRequestException('Invalid or expired token');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }

  async updateProfile(userId: number, data: { firstName?: string; lastName?: string; email?: string }) {
    // Only allow updating firstName, lastName, email
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }
} 