import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';

@Module({
  imports: [UsersModule],
  controllers: [TwoFactorAuthenticationController],
  providers: [TwoFactorAuthenticationService],
})
export class TwoFactorAuthenticationModule {}
