import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: 3600,
    },
  }), PassportModule.register({
    defaultStrategy: 'jwt',
  }),
  ],
  providers: [UserService, UserRepository, JwtStrategy],
  controllers: [UserController],
  exports: [ PassportModule,TypeOrmModule, JwtStrategy],
})
export class UserModule {}
