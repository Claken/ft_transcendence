import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule],
  providers: [FortyTwoStrategy, ConfigService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
