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
import * as nodemailer from 'nodemailer';

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

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmailForAuth(email);

    if (!user) return;

    const tokenId = randomUUID();
    const rawToken = randomUUID();
    const hash = await bcrypt.hash(rawToken, 10);

    const redisKey = `reset:${user.id}:${tokenId}`;

    await this.redis.set(redisKey, hash, 'EX', 15 * 60);
    console.log(this.config.get('NM_HOST'));

    const transporter = nodemailer.createTransport({
      host: this.config.get('NM_HOST'),
      port: this.config.get('NM_PORT'),
      secure: false,
      auth: {
        user: this.config.get('NM_USER'),
        pass: this.config.get('NM_PASS'),
      },
    });
    const resetLink = `localhost:${this.config.get(
      'FE_PORT',
    )}/api/auth/reset-password?token=${rawToken}`;
    await transporter.sendMail({
      from: '"Admin web doc truyen" <admin@ethereal.email>',
      to: email,
      subject: 'Reset Password ',
      html: `
              <p>Hi ${user.name ?? 'there'},</p>

              <p>We received a request to reset your password.</p>

              <p>
                This link will expire in <b>15 minutes</b>:
              </p>

              <p>
                <a href="${resetLink}" target="_blank">
                  Reset your password
                </a>
              </p>

              <p>If this was not you, please ignore this email.</p>

              <p>
                Thanks,<br/>
                Admin Team
              </p>
            `,
    });

    return;
  }

  async resetPassword(token: string, newPassword: string) {
    const keys = await this.redis.keys('reset:*');

    for (const key of keys) {
      const storedHash = await this.redis.get(key);
      if (!storedHash) continue;

      const match = await bcrypt.compare(token, storedHash);
      if (!match) continue;

      const userId = key.split(':')[1];

      await this.redis.del(key);

      const newHash = await bcrypt.hash(newPassword, 10);

      await this.usersService.updatePassword(userId, newHash);

      const refreshKeys = await this.redis.keys(`refresh:${userId}:*`);
      if (refreshKeys.length) {
        await this.redis.del(refreshKeys);
      }

      return;
    }

    throw new UnauthorizedException('Invalid or expired reset token');
  }
}
