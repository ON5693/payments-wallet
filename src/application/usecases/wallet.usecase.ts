import { CreateWalletAccount } from 'src/core/types';
import { IWalletRepository } from '../repositories/iwallet.repository';

export class WalletUseCase {
  constructor(private readonly repo: IWalletRepository) {}

  async getByUserId(userId: string) {
    return this.repo.getByUserId(userId);
  }

  async createBankAccount(entity: CreateWalletAccount, userId: string) {
    const wallet = await this.repo.getByUserId(userId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    return this.repo.createAccount(entity, wallet.id);
  }
}
