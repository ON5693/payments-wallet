import { ITransactionRepository } from '../repositories/itransaction.repository';
import { IWalletRepository } from '../repositories/iwallet.repository';
import { CreateTransactionDto, TransactionInternalDto } from 'src/core/types';
import { TransactionStatus, TransactionType } from 'src/core/enums';
import { IUserRepository } from '../repositories/iuser.repository';
import { randomBytes } from 'crypto';

export class TransactionUseCase {
  constructor(
    private readonly transactions: ITransactionRepository,
    private readonly wallets: IWalletRepository,
    private readonly users: IUserRepository,
  ) {}

  async credit(input: { userId: string; amount: number; endToEnd?: string }) {
    const { userId, amount, endToEnd } = input;
    try {
      if (amount < 0) {
        throw new Error('Invalid amount');
      }
      const wallet = await this.wallets.getByUserId(userId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      const endToEndId = endToEnd ?? randomBytes(32).toString('hex');
      const payload: CreateTransactionDto = {
        walletId: wallet.id,
        type: TransactionType.CREDIT,
        amount,
        endToEndId,
        status: TransactionStatus.COMPLETED,
      };
      const transaction = await this.transactions.create(payload);
      const newBalance = wallet.balance + amount;
      await this.wallets.updateBalance(wallet.id, newBalance);

      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async debit(input: { userId: string; amount: number }) {
    const { userId, amount } = input;
    try {
      if (amount < 0) {
        throw new Error('Invalid amount');
      }
      const wallet = await this.wallets.getByUserId(userId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      if (wallet.balance < amount) {
        throw new Error('Insufficient funds');
      }
      const endToEndId = randomBytes(32).toString('hex');
      const payload: CreateTransactionDto = {
        walletId: wallet.id,
        type: TransactionType.DEBIT,
        amount,
        endToEndId,
        status: TransactionStatus.COMPLETED,
      };
      const transaction = await this.transactions.create(payload);

      const newBalance = wallet.balance - amount;
      await this.wallets.updateBalance(wallet.id, newBalance);

      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async internalTransfer(input: TransactionInternalDto) {
    try {
      const { userId, amount, bankAccount } = input;
      const resultDebit = await this.debit({ userId, amount });
      const user = await this.users.findByDocument(bankAccount.document);
      if (!user) {
        throw new Error('User not found');
      }
      const resultCredit = await this.credit({
        userId: user.id,
        amount,
        endToEnd: resultDebit.endToEndId,
      });
      return {
        debit: resultDebit,
        credit: resultCredit,
      };
    } catch (error) {
      throw error;
    }
  }

  async refundUseCase(endToEndId: string) {
    try {
      const refundedTransaction =
        await this.transactions.findOriginalE2E(endToEndId);
      if (refundedTransaction) {
        throw new Error('Transfer already refunded');
      }
      const creditTransaction = await this.transactions.findByE2EType(
        endToEndId,
        TransactionType.CREDIT,
      );
      if (!creditTransaction) {
        throw new Error('Transaction not found');
      }
      const wallet = await this.wallets.getById(creditTransaction.walletId);

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const newEndToEndId = randomBytes(32).toString('hex');
      const payload: CreateTransactionDto = {
        walletId: wallet.id,
        type: TransactionType.DEBIT,
        amount: creditTransaction.amount,
        endToEndId: newEndToEndId,
        endToEndIdOriginal: endToEndId,
        status: TransactionStatus.REFUNDED,
      };
      const transaction = await this.transactions.create(payload);

      const newBalance = wallet.balance - creditTransaction.amount;
      await this.wallets.updateBalance(wallet.id, newBalance);

      const debitTransaction = await this.transactions.findByE2EType(
        endToEndId,
        TransactionType.DEBIT,
      );
      if (debitTransaction) {
        const debitWallet = await this.wallets.getById(
          debitTransaction.walletId,
        );
        if (debitWallet) {
          const payload: CreateTransactionDto = {
            walletId: debitWallet.id,
            type: TransactionType.CREDIT,
            amount: debitTransaction.amount,
            endToEndId: newEndToEndId,
            endToEndIdOriginal: endToEndId,
            status: TransactionStatus.REFUNDED,
          };
          await this.transactions.create(payload);
          const newBalance = debitWallet.balance + debitTransaction.amount;
          await this.wallets.updateBalance(debitWallet.id, newBalance);
        }
      }
      return transaction;
    } catch (error) {
      throw error;
    }
  }
}
