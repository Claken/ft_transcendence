import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // constructor(private reflector: Reflector){
    //     super()
    // }
    // canActivate(context: ExecutionContext): Promise<boolean> {
        // set metadata
    // }
}