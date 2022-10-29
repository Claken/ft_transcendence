import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { TokenPayload } from "src/TypeOrm/DTOs/User.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class TwoFAStrategy extends PassportStrategy(Strategy, 'twoFA') {
    constructor(
        private readonly userService: UsersService,
    ) {
        super();
    }

    async validate(payload: TokenPayload) {
        const user = await this.userService.getById(payload.user.id);
        if (!user.isTwoFAEnabled)
            return user;
        if (payload.isSecondFactorAuthenticated)
            return user;
    }
}