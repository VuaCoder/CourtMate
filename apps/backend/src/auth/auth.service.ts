import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    );
  }

  async validateUser(identifier: string, pass: string): Promise<any> {
    const user = await this.usersService.findByIdentifier(identifier);
    if (
      user &&
      user.passwordHash &&
      (await bcrypt.compare(pass, user.passwordHash))
    ) {
      const { passwordHash, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      identifier: user.identifier,
      sub: user._id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    identifier: string,
    pass: string,
    name?: string,
    role?: string,
  ) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(pass, salt);
    const newUser = await this.usersService.create({
      identifier,
      passwordHash,
      name,
      role: role || 'athlete',
    });
    return this.login(newUser);
  }

  async googleLogin(token: string, role?: string) {
    try {
      // Vì frontend dùng useGoogleLogin (implicit flow) nên token nhận được là access_token, không phải idToken
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new UnauthorizedException('Invalid Google access token');
      }

      const payload = await response.json();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      const user = await this.usersService.findOrCreateGoogleUser({
        identifier: payload.email,
        name: payload.name || 'Người dùng Google',
        avatarUrl: payload.picture,
        googleId: payload.sub,
        role: role,
      });

      return this.login(user);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
