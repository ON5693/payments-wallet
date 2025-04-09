import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDecimal } from 'class-validator';
import { BankAccountDto } from './bankAccountDto';

export class InternalTransferDto {
  @ApiProperty({ example: '16723da4-cf0b-4169-99ca-2ef6be37b546' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: '10.10' })
  @IsDecimal()
  amount: number;

  @ApiProperty()
  bankAccount: BankAccountDto;
}
