import { Wallet } from '../entities/wallet';
import { WalletBankAccount } from '../entities/wallet_bank_account';

export type UpdateWallet = Partial<Omit<Wallet, 'id' | 'createdAt'>>;

export type CreateWalletAccount = Omit<
  WalletBankAccount,
  'id' | 'walletId' | 'createdAt' | 'updatedAt'
>;
