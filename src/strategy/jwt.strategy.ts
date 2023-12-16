import { AuthService } from './../auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './types/jwt-payload.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.PRIVATE_KEY || 'secret_key',
    });
  }

  async validate(payload: JwtPayload): Promise<User | null> {
    const user = await this.authService.validateUserById(payload.sub);
    if (!user || user.confirmationToken) {
      throw new UnauthorizedException(
        'Invalid credentials or email not confirmed',
      );
    }
    return user;
  }
}
