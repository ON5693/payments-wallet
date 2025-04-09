import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefundInputDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  endToEndId: string;
}
