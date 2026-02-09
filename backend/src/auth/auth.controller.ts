import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthUser } from './decorators/auth-user.decorator';
import type { Payload } from 'src/interfaces';
import { Auth } from './decorators/auth.decorator';
import { envs } from 'src/config/envs.config';

@Controller('auth')
export class AuthController {
  private readonly nodeEnv = envs.nodeEnv;

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token } = await this.authService.login(loginDto);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: this.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return user;
  }

  @Auth()
  @Get('profile')
  profile(@AuthUser() user: Payload) {
    return user;
  }

  @Auth()
  @Get('check-status')
  async checkStatus(
    @AuthUser() user: Payload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user: userResult, token } =
      await this.authService.checkStatus(user);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: this.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return userResult;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Sesión cerrada correctamente' };
  }
}
