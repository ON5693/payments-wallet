import { User } from '../entities/user';

export type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
