import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module'; 

@Module({
  imports: [HttpModule, UserModule], 
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
