import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/domains/auth/dto/register.dto';
import { UsersService } from 'src/domains/users/users.service';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { UserAggregate } from 'src/domains/users/domain/user.aggregate';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    private readonly config: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async issueTokens(user: UserAggregate) {
    const sessionId = randomUUID();

    const payload = {
      sub: user.id,
      role: user.role,
      sid: sessionId,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('REFRESH_SECRET_KEY'),
      expiresIn: '7d',
    });

    const refreshHash = await bcrypt.hash(refreshToken, 10);

    const redisKey = `refresh:${user.id}:${sessionId}`;

    await this.redis.set(redisKey, refreshHash, 'EX', 7 * 24 * 60 * 60);

    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.config.get('REFRESH_SECRET_KEY'),
    });

    const redisKey = `refresh:${payload.sub}:${payload.sid}`;
    const storedHash = await this.redis.get(redisKey);

    if (!storedHash) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const isValid = await bcrypt.compare(token, storedHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.redis.del(redisKey);

    const user = await this.usersService.findByIdForAuth(payload.sub);

    return this.issueTokens(user);
  }

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });

    return {
      user: user.toDTO(),
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmailForAuth(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.usersService.verifyPassword(user, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isBanned) {
      throw new ForbiddenException('User is banned');
    }

    const tokens = await this.issueTokens(user);

    return {
      user: user.toDTO(),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(sub: string, sid: string) {
    await this.redis.del(`refresh:${sub}:${sid}`);
    return { message: 'Logged out' };
  }
}
