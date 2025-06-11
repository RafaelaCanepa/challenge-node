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
            passReqToCallback: true,
        });
        console.log('JWT_SECRET:', configService.get<string>('JWT_SECRET'));
        
    }

    async validate(request: Request, payload: JwtPayload): Promise<User> {
        const user = await this.userRepository.findOne(payload.email);
        if (!user) {
            throw new UnauthorizedException();
        }

        const authHeader = ExtractJwt.fromAuthHeaderAsBearerToken();
        const token = authHeader({ headers: request.headers });

        if (user.token !== token) {
            throw new UnauthorizedException('Token invalidated by logout');
        }

        return user;
    }
}