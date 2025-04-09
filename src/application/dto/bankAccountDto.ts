import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class BankAccountDto {
  @ApiProperty({ example: '12345678' })
  @IsString()
  ispb: string;

  @ApiProperty({ example: '001' })
  @IsString()
  @IsOptional()
  branchCode?: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  accountNumber: string;

  @ApiProperty({ example: 'tran' })
  @IsString()
  accountType: string;

  @ApiProperty({ example: '12345678910' })
  @IsString()
  document: string;
}
