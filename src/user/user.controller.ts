import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.credential.dto';
import { UserService } from './user.service';
//import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userService.signUp(authCredentialsDto);
    }

    @Post('login')
    signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.userService.signIn(authCredentialsDto);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    
    logout(@GetUser() user: User): Promise<void> {
        return this.userService.logOut(user);
    }
}
