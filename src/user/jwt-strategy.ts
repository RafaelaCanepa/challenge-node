import { JwtPayload } from "./jwt-payload.interface";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userRepository: UserRepository,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
        console.log('JWT_SECRET:', configService.get<string>('JWT_SECRET'));
        
    }

    async validate(payload: JwtPayload): Promise<User> {
        console.log('aca esta el PAYLOAD:', payload);
        const { username } = payload;
        console.log('username:', username);
        console.log('email:', payload.email);

        const user = await this.userRepository.findOne(payload.email);
        if (!user) {
            console.log('aca esta el user:', user);
            throw new UnauthorizedException();
        }
        return user;
    }
}