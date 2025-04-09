import { User } from 'src/core/entities/user';
import { CreateUserDto } from 'src/core/types/user';

export interface IUserRepository {
  create(entity: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByDocument(document: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}
