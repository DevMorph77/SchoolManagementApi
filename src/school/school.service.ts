import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { School, Prisma } from '@prisma/client';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SchoolCreateInput): Promise<School> {
    return this.prisma.school.create({
      data: {
        name: data.name,
        address: data.address,
      },
    });
  }

  async findAll(): Promise<School[]> {
    return this.prisma.school.findMany();
  }

  async findOne(id: number): Promise<School | null> {
    return this.prisma.school.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.SchoolUpdateInput): Promise<School> {
    return this.prisma.school.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<School> {
    return this.prisma.school.delete({
      where: { id },
    });
  }
} 