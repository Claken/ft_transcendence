import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUser } from 'src/TypeOrm/Entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(user: IUser): Promise<IUser> {
    const { id: userId } = user;
    const userFound = await this.usersService.getById(userId);
    if (userFound) return userFound;
    return null;
  }

  login(user: IUser): { access_token: string } {
    const payload = {
      name: user.username,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // verify(token: string) {
  //   const decodef = this.jwtService.verify(token, {
  // 	  secret: this.configService.get<string>('JWT_SECRET')
  //   })
  // }

  public getCookieWithJwtToken(userId: number) {
    const payload: any = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=3600s`;
  }
  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
