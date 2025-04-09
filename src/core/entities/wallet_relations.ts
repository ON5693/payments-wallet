import { User } from './user';
import { Transaction } from './transaction';
import { WalletBankAccount } from './wallet_bank_account';

export class WalletRelations {
  user: User;

  transactions: Transaction[];

  walletBankAccount?: WalletBankAccount;
}
