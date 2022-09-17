import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUser } from 'src/TypeOrm/Entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { IAuth } from './models/auths.interface';
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements IAuth {
  constructor(private usersService: UsersService,
	private jwtService: JwtService,
	private configService: ConfigService) {}

  async validateUser(userDetails: IUser) {
    const { id: userId } = userDetails;
    const userFound = await this.usersService.getById(userId);
    if (userFound) return userFound;
    // should throw error if !userFound you cannot connect
    return this.createUser(userDetails);
  }
  createUser(userDetails: IUser) {
    return this.usersService.create(userDetails);
  }

  login(user: IUser): { access_token : string} {
	  const payload = {
		  email: user.emails,
		  sub: user.id
	  }
	  return {
		  access_token: this.jwtService.sign(payload)
	  }
  }

  verify(token: string) {
	  const decodef = this.jwtService.verify(token, {
		  secret: this.configService.get<string>('JWT_SECRET')
	  })
  }

  async findUserById(userId: number): Promise<IUser | undefined> {
    return await this.usersService.getById(userId);
  }
}
