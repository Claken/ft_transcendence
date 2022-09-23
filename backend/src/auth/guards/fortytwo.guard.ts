import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
    // AuthGuard name's has to be equal to FortyTwoStrategy name's
    
}
