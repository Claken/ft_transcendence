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

	  async findOneChatRoomByName(name: string): Promise<ChatRoomEntity> {
		return await this.chatRepo.findOneBy({chatRoomName: name});
	  }

	  async findOneChatRoomById(id: number): Promise<ChatRoomEntity> {
		return await this.chatRepo.findOneBy({id});
	  }

	//   async createChatRoom

	  async deleteChatRoom(name: string): Promise<void> {
		await this.chatRepo.delete(name);
	  }

	//   async createAChatRoom() : 
}
