import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PrismaUserRepository } from '../../infrastructure/repositories/user.repository';
import { UserUseCase } from 'src/application/usecases/user.usecase';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { PrismaWalletRepository } from 'src/infrastructure/repositories/wallet.repository';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/application/dto/createUserDto';
import { EmailDto } from 'src/application/dto/emailDto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly repo: PrismaUserRepository,
    private readonly wallets: PrismaWalletRepository,
    private readonly jwtService: JwtService,
  ) {
    this.useCase = new UserUseCase(this.repo, this.wallets);
  }
  private readonly useCase: UserUseCase;

  @Post()
  @ApiOperation({ summary: 'Create User' })
  async create(@Body() body: CreateUserDto) {
    return this.useCase.create(body);
  }

  @Post('access')
  @ApiOperation({ summary: 'Create Access Token' })
  async login(@Body() body: EmailDto) {
    const user = await this.repo.findByEmail(body.email);
    if (!user) throw new Error('User not found');
    const token = this.jwtService.sign({ userId: user.id });
    return { access_token: token };
  }

  @Get()
  @ApiOperation({ summary: 'List User' })
  @UseGuards(AuthGuard)
  async findAll() {
    return this.useCase.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consult User by Id' })
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.useCase.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User' })
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.useCase.delete(id);
  }
}
