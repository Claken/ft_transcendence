import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TwoFactorAuthenticationService } from '../two-factor-authentication/two-factor-authentication.service';

@Injectable()
// AuthGuard name's has to be equal to FortyTwoStrategy name's
export class FortyTwoAuthGuard extends AuthGuard('42') {
  // constructor(private readonly twoFAService: TwoFactorAuthenticationService) {
  //   super();
  // }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check 42login and 42password
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    // initialize the server-side session and save it in memory
    await super.logIn(request);
    return activate;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // The isAuthenticated function is attached to request object by Passport
    return request.isAuthenticated();
  }
}
