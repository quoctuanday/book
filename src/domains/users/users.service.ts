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

  async create(dto: {
    email: string;
    password: string;
    name?: string;
    avatarUrl?: string;
    role?: any;
  }) {
    const exists = await this.userRepo.existsByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already used');

    const hash = await bcrypt.hash(dto.password, 10);
    const agg = UserAggregate.createNew({
      email: dto.email,
      passwordHash: hash,
      name: dto.name,
      avatarUrl: dto.avatarUrl,
      role: dto.role,
    });
    const saved = await this.userRepo.save(agg);
    return saved.toDTO();
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
