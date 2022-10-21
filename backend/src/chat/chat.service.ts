import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ChatRoomEntity } from '../TypeOrm/Entities/chat.entity';
import { CreateRoomDto } from '../TypeOrm/DTOs/chat.dto'
import { UsersService } from 'src/users/users.service';

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

	  async createChatRoom(chatRoom: CreateRoomDto): Promise<ChatRoomEntity> {
		
		const newChat = this.chatRepo.create(chatRoom);
		return this.chatRepo.save(chatRoom);
	  }

	  async deleteChatRoom(name: string): Promise<void> {
		await this.chatRepo.delete(name);
	  }

	//   async createAChatRoom() : 
}
