import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/models/users.entity';
import { SessionSerializer } from './utils/Serialize';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([UsersEntity])],
  controllers: [AuthController],
  providers: [
    FortyTwoStrategy,
    AuthService,
    SessionSerializer,
    // check why doesn't work
    { 
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    
  ],
})
export class AuthModule {}
