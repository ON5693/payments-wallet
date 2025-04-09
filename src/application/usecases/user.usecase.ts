import { IUserRepository } from '../repositories/iuser.repository';
import { CreateUserDto } from 'src/core/types';
import { IWalletRepository } from '../repositories/iwallet.repository';

export class UserUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly wallets: IWalletRepository,
  ) {}

  async create(input: CreateUserDto) {
    const user = await this.users.create(input);
    await this.wallets.create(user.id);
    return user;
  }

  async findAll() {
    return this.users.findAll();
  }

  async findById(id: string) {
    return this.users.findById(id);
  }

  async delete(id: string) {
    return this.users.delete(id);
  }
}
