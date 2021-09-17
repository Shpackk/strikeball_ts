import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecret',
    });
  }

  async validate(payload: any) {
    if (payload.roleId == 3) {
      return {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        roleId: payload.roleId
      };
    } else {
      throw new HttpException({
        error: 'No permission for this route'
      }, HttpStatus.UNAUTHORIZED)
    }
  }
}