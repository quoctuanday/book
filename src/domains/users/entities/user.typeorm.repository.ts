import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../domain/user.repository.interface';
import { UserAggregate } from '../domain/user.aggregate';
import { User } from './user.entity';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findById(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    return e ? e.toAggregate() : null;
  }

  async findByEmail(email: string) {
    const e = await this.repo.findOne({ where: { email } });
    return e ? e.toAggregate() : null;
  }

  async existsByEmail(email: string) {
    const count = await this.repo.count({ where: { email } });
    return count > 0;
  }

  async save(user: UserAggregate) {
    const entity = User.fromAggregate(user);
    const saved = await this.repo.save(entity);
    return saved.toAggregate();
  }

  async remove(id: string) {
    await this.repo.delete(id);
  }

  async findAll(opts?: { page?: number; limit?: number }) {
    const page = opts?.page ?? 1;
    const limit = opts?.limit ?? 20;
    const [items, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items: items.map((i) => i.toAggregate()), total };
  }
}
