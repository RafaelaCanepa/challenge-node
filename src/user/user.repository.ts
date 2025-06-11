import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class UserRepository {
    
    constructor(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        @InjectRepository(User)
        private readonly UserRepo: Repository<User>,
      ) {}

    async createUser(signupDto: SignupDto): Promise<void> {
        const { username, password, email } = signupDto;
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.UserRepo.create({ username, email, password: hashedPassword });
        try {
            await this.UserRepo.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            }
            else {
                console.log(error.code);
                throw new InternalServerErrorException();
            }
        }
    }

    async findOne(email: string): Promise<User | null> {
        try {
            return await this.UserRepo.findOne({ where: { email } });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }

    async findByToken(user: User): Promise<User | null> {
        try {
            return await this.UserRepo.findOne({ where: { id: user.id } });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }

    async logOut(user: User): Promise<void> {
        await this.UserRepo.update(user.id, { token: '' });
    }

    async update(user: User, token: string): Promise<void> {
        await this.UserRepo.update(user.id, { token });
    }
}   



