import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IWalletRepository } from 'src/application/repositories/iwallet.repository';
import { CreateWalletAccount } from 'src/core/types';

@Injectable()
export class PrismaWalletRepository implements IWalletRepository {
  constructor(private prisma: PrismaService) {}

  async getByUserId(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (wallet) {
      return {
        ...wallet,
        updatedAt: wallet.updatedAt ?? undefined,
      };
    }
    return null;
  }

  async getById(id: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id } });
    if (wallet) {
      return {
        ...wallet,
        updatedAt: wallet.updatedAt ?? undefined,
      };
    }
    return null;
  }

  async updateBalance(walletId: string, newBalance: number) {
    const updatedWallet = await this.prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    });

    return {
      ...updatedWallet,
      updatedAt: updatedWallet.updatedAt ?? undefined,
    };
  }

  async createAccount(entity: CreateWalletAccount, walletId: string) {
    const account = await this.prisma.walletBankAccount.create({
      data: {
        ...entity,
        walletId,
      },
    });

    return {
      ...account,
      branchCode: account.branchCode ?? undefined,
      updatedAt: account.updatedAt ?? undefined,
    };
  }

  async create(userId: string, balance?: number) {
    const wallet = await this.prisma.wallet.create({
      data: {
        userId,
        balance,
      },
    });

    return {
      ...wallet,
      updatedAt: wallet.updatedAt ?? undefined,
    };
  }
}
