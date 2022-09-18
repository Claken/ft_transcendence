import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly userService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET
		})
	}
	async validate(payload: any) {
		return { 
			id: payload.sub,
			name: payload.name
		};
	}
}