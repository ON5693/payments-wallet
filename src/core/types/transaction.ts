import { Transaction } from '../entities/transaction';
import { CreateWalletAccount } from './wallet';

export type CreateTransactionDto = Omit<
  Transaction,
  'id' | 'createdAt' | 'updatedAt'
>;

export type TransactionInternalDto = {
  userId: string;
  amount: number;
  bankAccount: CreateWalletAccount & { document: string };
};
