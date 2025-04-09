import { Transaction } from 'src/core/entities/transaction';
import { TransactionType } from 'src/core/enums';
import { CreateTransactionDto } from 'src/core/types';

export interface ITransactionRepository {
  create(entity: CreateTransactionDto): Promise<Transaction>;
  findByE2EType(
    endToEndId: string,
    transactionType: TransactionType,
  ): Promise<Transaction | null>;
  findOriginalE2E(endToEndIdOriginal: string): Promise<Transaction | null>;
}
