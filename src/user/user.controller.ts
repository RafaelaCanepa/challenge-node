import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserService } from './user.service';
//import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto'; 
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    signUp(@Body() signupDto: SignupDto): Promise<void> {
        return this.userService.signUp(signupDto);
    }

    @Post('login')
    signIn(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
        return this.userService.signIn(loginDto);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    logout(@GetUser() user: User): Promise<void> {
        return this.userService.logOut(user);
    }
}
