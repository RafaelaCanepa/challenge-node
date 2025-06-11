import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth.credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, email, password } = authCredentialsDto;

        const user = await this.userRepository.findOne(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username: user.username, email: user.email };
            const accessToken = this.jwtService.sign(payload);
            await this.userRepository.update(user, accessToken);
            return { accessToken };
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async logOut(user: User): Promise<void> {
        return this.userRepository.logOut(user);
    }

}
