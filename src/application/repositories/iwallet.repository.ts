import { Wallet } from 'src/core/entities/wallet';
import { WalletBankAccount } from 'src/core/entities/wallet_bank_account';
import { CreateWalletAccount } from 'src/core/types';

export interface IWalletRepository {
  create(userId: string, balance?: number): Promise<Wallet>;
  getByUserId(userId: string): Promise<Wallet | null>;
  getById(id: string): Promise<Wallet | null>;
  updateBalance(walletId: string, newBalance: number): Promise<Wallet>;
  createAccount(
    entity: CreateWalletAccount,
    walletId: string,
  ): Promise<WalletBankAccount>;
}
