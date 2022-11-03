import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IChatRoom, ChatRoomEntity } from '../TypeOrm/Entities/chat.entity';
import { CreateRoomDto } from '../TypeOrm/DTOs/chat.dto'
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChatRoomEntity)
		private readonly chatRepo: Repository<ChatRoomEntity>,
	  	) {}

	  async findAllChatRooms(): Promise<ChatRoomEntity[]> {
		return await this.chatRepo.find({relations: ['owner', 'members']});
	  }

	  async findOneChatRoomByName(name: string): Promise<ChatRoomEntity> {
		return await this.chatRepo.findOne({where: {chatRoomName: name}, relations: ['owner', 'members'],});
	  }

	  async findOneChatRoomById(id: string): Promise<ChatRoomEntity> {
		return await this.chatRepo.findOne({where: {id: id}, relations: ['owner', 'members'],});
	  }

	  async createChatRoom(chatRoom: IChatRoom): Promise<ChatRoomEntity> {
		
		const newChat = this.chatRepo.create(chatRoom);
		return await this.chatRepo.save(chatRoom);
	  }

	  async deleteChatRoomByName(name: string): Promise<void> {
		await this.chatRepo.delete({ chatRoomName: name });
	  }

	//   async updateChatRoom(chatRoomId: string): Promise<ChatRoomEntity> {
	// 	const chatRoom = await this.findOneChatRoomById(chatRoomId);
	// 	return this.chatRepo.save(chatRoom);
	//   }
}
