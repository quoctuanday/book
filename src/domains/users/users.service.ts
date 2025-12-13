import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UserAggregate } from 'src/domains/users/domain/user.aggregate';
import { IUserRepository } from 'src/domains/users/domain/user.repository.interface';

const USER_REPO = 'USER_REPO';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepository) {}

  async createUser(params: {
    email: string;
    passwordHash: string;
    name?: string;
  }) {
    const exists = await this.userRepo.existsByEmail(params.email);
    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const user = UserAggregate.createNew({
      email: params.email,
      passwordHash: params.passwordHash,
      name: params.name,
    });

    const saved = await this.userRepo.save(user);
    return saved;
  }

  async findByEmailForAuth(email: string): Promise<UserAggregate | null> {
    return this.userRepo.findByEmail(email);
  }
  async verifyPassword(
    user: UserAggregate,
    plainPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, user['passwordHash']);
  }

  async getById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user.toDTO();
  }

  async list(page = 1, limit = 20) {
    const { items, total } = await this.userRepo.findAll({ page, limit });
    return { items: items.map((i) => i.toDTO()), total };
  }
}
