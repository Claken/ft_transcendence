import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { IUser } from "src/TypeOrm/Entities/users.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly userService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET
		})
	}
	async validate(validationPayload : { email: string, sub: string }): Promise<IUser> | null {
		return await this.userService.getByEmail(validationPayload.email);
	}
}