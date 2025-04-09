import { Module } from '@nestjs/common';
import { UserController } from './interfaces/handlers/user.controller';
import { WalletController } from './interfaces/handlers/wallet.controller';
import { TransactionController } from './interfaces/handlers/transaction.controller';
import { PrismaService } from './infrastructure/database/prisma.service';
import { PrismaUserRepository } from './infrastructure/repositories/user.repository';
import { PrismaWalletRepository } from './infrastructure/repositories/wallet.repository';
import { PrismaTransactionRepository } from './infrastructure/repositories/transaction.repository';
import { AuthGuard } from './interfaces/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, WalletController, TransactionController],
  providers: [
    PrismaService,
    PrismaUserRepository,
    PrismaWalletRepository,
    PrismaTransactionRepository,
    AuthGuard,
  ],
})
export class AppModule {}
