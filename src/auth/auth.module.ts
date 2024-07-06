import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [JwtStrategy,],
})
export class AuthModule { }
