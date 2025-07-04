/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, MinLength, MaxLength, Matches, IsEmail } from 'class-validator';

export class SignupDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string ;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password must contain at least 1 upper case letter, 1 lower case letter and 1 number or special character'})
    password: string;
}