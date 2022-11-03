import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRoomEntity } from '../TypeOrm/Entities/chat.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { MemberService } from './member.service';
import { MemberEntity } from 'src/TypeOrm';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ChatRoomEntity]), TypeOrmModule.forFeature([MemberEntity])],
  providers: [ChatService, ChatGateway, MemberService]
})
export class ChatModule {}
