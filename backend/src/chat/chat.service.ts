import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IChatRoom, ChatRoomEntity } from '../TypeOrm/Entities/chat.entity';

// import { Repository } from 'typeorm'

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChatRoomEntity)
		private readonly chatRepo: Repository<ChatRoomEntity>,
	  ) {}

	  findAllChatRooms(): Promise<ChatRoomEntity[]> {
		return this.chatRepo.find();
	  }
}
