import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.admin.findMany({
      include: { user: true, school: true }
    });
  }

  async findOne(id: number) {
    return this.prisma.admin.findUnique({
      where: { id },
      include: { user: true, school: true }
    });
  }

  async create(data: { email: string; firstName: string; lastName: string; schoolId: number; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // Check if school exists
    const school = await this.prisma.school.findUnique({ where: { id: data.schoolId } });
    if (!school) throw new BadRequestException('School not found');
    // Create user and admin in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'ADMIN',
          schoolId: data.schoolId,
        },
      });
      const admin = await prisma.admin.create({
        data: {
          userId: user.id,
          schoolId: data.schoolId,
        },
        include: { user: true, school: true }
      });
      return { user: { ...user, password: data.password }, admin };
    });
    return result;
  }

  async update(id: number, updateAdminDto: any) {
    // Only allow updating certain fields
    return this.prisma.admin.update({
      where: { id },
      data: updateAdminDto,
      include: { user: true, school: true }
    });
  }

  async remove(id: number) {
    // Delete both admin and user
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new BadRequestException('Admin not found');
    await this.prisma.user.delete({ where: { id: admin.userId } });
    return this.prisma.admin.delete({ where: { id } });
  }
} 