import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from '../TypeOrm/Entities/users.entity';
import { AvatarModule } from 'src/avatar/avatar.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, AvatarModule, TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
