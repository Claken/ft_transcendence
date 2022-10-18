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

		async findAllChatRooms(): Promise<ChatRoomEntity[]> {
		return await this.chatRepo.find();
	  }

	  async create(chatRoom: IChatRoom): Promise<ChatRoomEntity> {
		const newChatRoom = this.chatRepo.create(chatRoom);
		return await this.chatRepo.save(newChatRoom);
	  }


}
