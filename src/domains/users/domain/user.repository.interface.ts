import { UserAggregate } from './user.aggregate';

export interface IUserRepository {
  findById(id: string): Promise<UserAggregate | null>;
  findByEmail(email: string): Promise<UserAggregate | null>;
  existsByEmail(email: string): Promise<boolean>;
  save(user: UserAggregate): Promise<UserAggregate>;
  remove(id: string): Promise<void>;
  findAll(opts?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: UserAggregate[]; total: number }>;
}
