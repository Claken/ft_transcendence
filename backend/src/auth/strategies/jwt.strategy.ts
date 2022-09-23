import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // With PassportStrategy validate() is automatically called
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  async validate(payload: any) { 
    // here we don't really check whether the token is valid or not
    // it's already done in the super() call above
    // TokenPayload instead of any
    return {
      id: payload.sub,
      name: payload.name,
    };
  }
}
