import { PassportStrategy } from '@nestjs/passport';
import { VerifiedCallback } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { UsersPost } from 'src/users/models/users.interface';
import { AuthService } from './auth.service';

export class ApiStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      client_id: '', //CLIENT_ID,
      redirect_uri: '', //REDIRECT_URI,
      scope: '',
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ): Promise<any> {
    const {name, emails, photos} = profile;
    const user = {
      email: emails[0].value,
      username: name.givenName,
      pic: photos[0].value,
      accessToken
    }
    done(null, user);
  }
}
