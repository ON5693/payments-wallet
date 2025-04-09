import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ITransactionRepository } from 'src/application/repositories/itransaction.repository';
import { CreateTransactionDto } from 'src/core/types';
import { Transaction } from 'src/core/entities/transaction';
import { TransactionType } from 'src/core/enums';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaService) {}

  async create(entity: CreateTransactionDto): Promise<Transaction> {
    const save = await this.prisma.transaction.create({
      data: entity,
    });
    return {
      ...save,
      endToEndIdOriginal: save.endToEndIdOriginal ?? undefined,
      updatedAt: save.updatedAt ?? undefined,
    };
  }

  async findByE2EType(
    endToEndId: string,
    transactionType: TransactionType,
  ): Promise<Transaction | null> {
    const result = await this.prisma.transaction.findFirst({
      where: { endToEndId, type: transactionType },
    });
    if (!result) return null;
    return {
      ...result,
      endToEndIdOriginal: result.endToEndIdOriginal ?? undefined,
      updatedAt: result.updatedAt ?? undefined,
    };
  }

  async findOriginalE2E(
    endToEndIdOriginal: string,
  ): Promise<Transaction | null> {
    const result = await this.prisma.transaction.findFirst({
      where: { endToEndIdOriginal },
    });
    if (!result) return null;
    return {
      ...result,
      endToEndIdOriginal: result.endToEndIdOriginal ?? undefined,
      updatedAt: result.updatedAt ?? undefined,
    };
  }
}
