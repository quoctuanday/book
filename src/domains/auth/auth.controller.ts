import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/domains/auth/auth.service';
import { Public } from 'src/domains/auth/decorators/public.decorator';
import { LoginDto } from 'src/domains/auth/dto/login.dto';
import { RegisterDto } from 'src/domains/auth/dto/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
