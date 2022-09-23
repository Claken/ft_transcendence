import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // constructor(private reflector: Reflector) {
    //     super();
    // }
    // canActivate(context: ExecutionContext): Promise<boolean> {
    //     const request : context.switchToHttp().getContext();
    // }
}