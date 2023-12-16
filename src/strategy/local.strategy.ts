import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { ITokenUser } from 'src/auth/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'login') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<ITokenUser | null> {
    const user = await this.authService.validateUser(email, password);
    if (!user || user.confirmationToken) {
      throw new UnauthorizedException(
        'Invalid credentials or email not confirmed',
      );
    }
    return user;
  }
}
