import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WalletUseCase } from 'src/application/usecases/wallet.usecase';
import { CreateWalletAccount } from 'src/core/types';
import { PrismaWalletRepository } from 'src/infrastructure/repositories/wallet.repository';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Wallets')
@Controller('wallets')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly repo: PrismaWalletRepository) {
    this.usecase = new WalletUseCase(this.repo);
  }
  private readonly usecase: WalletUseCase;

  @Get('user/:userId')
  @ApiOperation({ summary: 'Consult Wallet by User' })
  async getByUser(@Param('userId') userId: string) {
    return this.usecase.getByUserId(userId);
  }

  @Post('account/:userId')
  @ApiOperation({ summary: 'Create Bank Account' })
  async createAccount(
    @Body() body: CreateWalletAccount,
    @Param('userId') userId: string,
  ) {
    return this.usecase.createBankAccount(body, userId);
  }
}
