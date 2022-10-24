import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './strategies/fortytwo.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/TypeOrm';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './serializer/session.serializer';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
    }),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  controllers: [AuthController],
  providers: [FortyTwoStrategy, AuthService, SessionSerializer],
})
export class AuthModule {}
