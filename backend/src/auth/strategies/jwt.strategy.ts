import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { envs } from 'src/config/envs.config';
import { UsersService } from 'src/users/users.service';
import type { Payload } from 'src/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          if (!req || !req.cookies) return null;
          return req.cookies['access_token'] as string;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: envs.jwtSecret,
    });
  }

  async validate(payload: Payload) {
    const user = await this.usersService.findOneById(payload.id);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token no válido o usuario inactivo');
    }

    return user;
  }
}
