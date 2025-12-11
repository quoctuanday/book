import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserTypeOrmRepository } from 'src/domains/users/entities/user.typeorm.repository';

const USER_REPO = 'USER_REPO';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USER_REPO, useClass: UserTypeOrmRepository },
    UserTypeOrmRepository,
  ],
  exports: [UsersService],
})
export class UsersModule {}
