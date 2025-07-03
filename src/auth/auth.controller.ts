import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from '../common/decorators/auth/public.decorator';
import { CurrentUser } from '../common/decorators/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    const { password, ...result } = user;
    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    const { password, ...result } = user;
    return result;
  }
}
