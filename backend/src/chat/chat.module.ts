import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRoomEntity } from './chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoomEntity])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway]
})
export class ChatModule {}
