import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/strategies/jwt-payload.interface';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService) {}

    async signUp(signupDto: SignupDto): Promise<void> {
        return this.userRepository.createUser(signupDto);
    }

    async signIn(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const { email, password } = loginDto;

        const user = await this.userRepository.findOne(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { email: user.email };
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
