import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionSerializer } from './utils/Serialize';
import { UsersEntity } from 'src/TypeOrm';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([UsersEntity])],
  controllers: [AuthController],
  providers: [
    FortyTwoStrategy,
    SessionSerializer,
    { 
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    
  ],
})
export class AuthModule {}
