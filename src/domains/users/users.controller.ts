import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/domains/auth/decorators/public.decorator';
import { UpdateUserProfileDto } from 'src/domains/users/dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  get() {
    return this.usersService.list();
  }

  @Patch('me')
  updateProfile(@Req() req: Request, @Body() dto: UpdateUserProfileDto) {
    const userId = req['user'].sub;
    return this.usersService.updateProfile(userId, dto);
  }
}
