import { TransactionType, TransactionStatus } from '@prisma/client';

export class Transaction {
  id: string;

  walletId: string;

  type: TransactionType;

  amount: number;

  status: TransactionStatus;

  endToEndId: string;

  endToEndIdOriginal?: string;

  updatedAt?: Date;

  createdAt: Date;
}
