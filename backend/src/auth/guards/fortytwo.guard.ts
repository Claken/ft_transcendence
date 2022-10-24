import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
  // AuthGuard name's has to be equal to FortyTwoStrategy name's
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check 42login and 42password
    const activate = (await super.canActivate(context)) as boolean;
    // initialize the server-side session and save it in memory
    const request = context.switchToHttp().getRequest();
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
