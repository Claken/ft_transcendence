import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './strategies/fortytwo.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/TypeOrm';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './serializer/session.serializer';
import { AuthGateway } from './auth.gateway';
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';
import { TwoFactorAuthenticationService } from './two-factor-authentication/two-factor-authentication.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    // MulterModule.register({
    //   dest: './avatar',
    // }),    
    PassportModule.register({
      session: true,
    }),
    TypeOrmModule.forFeature([UsersEntity]),
    TwoFactorAuthenticationModule,
  ],
  controllers: [AuthController],
  providers: [
    FortyTwoStrategy,
    AuthService,
    SessionSerializer,
    AuthGateway,
    TwoFactorAuthenticationService,
  ],
})
export class AuthModule {}
