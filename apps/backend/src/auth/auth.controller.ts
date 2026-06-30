import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { identifier: string; password: string }) {
    const user = await this.authService.validateUser(body.identifier, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: { identifier: string; password: string; name?: string; role?: string }) {
    try {
      const tokenResponse = await this.authService.register(body.identifier, body.password, body.name, body.role);
      return { message: 'User registered successfully', ...tokenResponse };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new HttpException('Identifier already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('google')
  async googleLogin(@Body() body: { token: string; role?: string }) {
    if (!body.token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }
    return this.authService.googleLogin(body.token, body.role);
  }
}
