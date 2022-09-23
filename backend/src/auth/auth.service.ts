import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUser } from 'src/TypeOrm/Entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(user: IUser): Promise<IUser> {
    const { id } = user;
    const userFound = await this.usersService.getById(id);
    if (userFound) return userFound;
    return await this.usersService.create(user);
  }

  async login(user: IUser) {
    const payload = {
      name: user.login,
      sub: user.id,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: 3600, // 1h
    });
    const hash_token = await bcrypt.hash(access_token, 10);
    const { id: userId } = user;

    await this.usersService.updateToken(userId, hash_token);
    return { access_token: access_token };
  }

  async logout(user: IUser) {
    const { id: userId } = user;
    await this.usersService.updateToken(userId, null);
  }
  //unuse
  public getCookieWithJwtToken(userId: number) {
    const payload: any = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=3600s`;
  }
  //unuse
  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
