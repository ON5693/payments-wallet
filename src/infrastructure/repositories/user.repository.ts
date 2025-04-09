import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from 'src/core/types';
import { IUserRepository } from 'src/application/repositories/iuser.repository';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(entity: CreateUserDto) {
    return this.prisma.user.create({
      data: entity,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({ include: { wallet: true } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { wallet: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { wallet: true },
    });
  }

  async findByDocument(document: string) {
    return this.prisma.user.findUnique({
      where: { document },
      include: { wallet: true },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
