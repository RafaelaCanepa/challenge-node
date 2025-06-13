import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { MovieService } from './movie/movie.service';
import { MovieController } from './movie/movie.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserRepository } from './user/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt-strategy';
import { MovieModule } from './movie/movie.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.stage.dev',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'challenge-rafa',
      entities: [User],
      synchronize: true,
    }), 
    UserModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    MovieModule,
    HttpModule,
  ],
  controllers: [UserController, MovieController],
  providers: [UserService, MovieService, JwtStrategy, UserRepository],
})
export class AppModule {}
