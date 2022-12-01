import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from '../TypeOrm/Entities/users.entity';
import { AvatarModule } from 'src/avatar/avatar.module';
import { HttpModule } from '@nestjs/axios';
import { Socket } from 'src/TypeOrm/Entities/sockets.entity';

@Module({
  imports: [HttpModule, AvatarModule, TypeOrmModule.forFeature([UsersEntity, Socket])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
