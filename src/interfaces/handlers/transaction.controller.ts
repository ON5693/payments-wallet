import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PrismaTransactionRepository } from '../../infrastructure/repositories/transaction.repository';
import { PrismaWalletRepository } from '../../infrastructure/repositories/wallet.repository';
import { TransactionUseCase } from 'src/application/usecases/transaction.usecase';
import { PrismaUserRepository } from 'src/infrastructure/repositories/user.repository';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransactionInputDto } from 'src/application/dto/transactionInputDto';
import { InternalTransferDto } from 'src/application/dto/internalTransferDto';
import { RefundInputDto } from 'src/application/dto/refundInputDto';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(
    private readonly transactions: PrismaTransactionRepository,
    private readonly wallets: PrismaWalletRepository,
    private readonly users: PrismaUserRepository,
  ) {
    this.useCase = new TransactionUseCase(
      this.transactions,
      this.wallets,
      this.users,
    );
  }

  private readonly useCase: TransactionUseCase;

  @Post('credit')
  @ApiOperation({ summary: 'Create Credit Transaction' })
  async credit(@Body() body: TransactionInputDto) {
    return this.useCase.credit(body);
  }

  @Post('debit')
  @ApiOperation({ summary: 'Create Debit Transaction' })
  async debit(@Body() body: TransactionInputDto) {
    return this.useCase.debit(body);
  }

  @Post('internal-transfer')
  @ApiOperation({ summary: 'Create Internal Transaction' })
  async internalDebit(@Body() body: InternalTransferDto) {
    return this.useCase.internalTransfer(body);
  }

  @Post('refund')
  @ApiOperation({ summary: 'Create Refund Transaction' })
  async refund(@Body() body: RefundInputDto) {
    return this.useCase.refundUseCase(body.endToEndId);
  }
}
