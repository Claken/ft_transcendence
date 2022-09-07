import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersPost } from 'src/users/models/users.interface';
import { AuthService } from './auth.service';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  validate(email: string, password: string): Promise<UsersPost> {
    return this.authService.getAuthenticatedUser(email, password);
  }
}
