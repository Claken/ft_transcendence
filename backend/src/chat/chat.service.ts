import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IChatRoom, ChatRoomEntity } from '../TypeOrm/Entities/chat.entity';
import { ChatRoomDto } from '../TypeOrm/DTOs/chat.dto'
import { UsersService } from 'src/users/users.service';
import { MemberEntity } from 'src/TypeOrm';
import { type } from 'src/exports/enum';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChatRoomEntity)
		private readonly chatRepo: Repository<ChatRoomEntity>,
	  	) {}

	  async findAllChatRooms(): Promise<ChatRoomEntity[]> {
		return await this.chatRepo.find({relations: ['owner', 'members', 'members.user', 'messages']});
	  }

	  async findAllPrivateRooms(): Promise<ChatRoomEntity[]> {
		return await this.chatRepo.find({where: {type: type.private}, relations: ['owner', 'members', 'members.user', 'messages']});
	  }

	  async findOneChatRoomByName(name: string): Promise<ChatRoomEntity> {
		return await this.chatRepo.findOne({where: {chatRoomName: name}, relations: ['owner', 'members', 'messages'],});
	  }

	  async findOneChatRoomById(id: string): Promise<ChatRoomEntity> {
		return await this.chatRepo.findOne({where: {id: id}, relations: ['owner', 'members', 'messages'],});
	  }

	  async createChatRoom(chatRoom: IChatRoom): Promise<ChatRoomEntity> {
		return this.chatRepo.create(chatRoom);
	  }

	  async saveChatRoom(chatRoom: ChatRoomEntity) : Promise<ChatRoomEntity> {
		return await this.chatRepo.save(chatRoom);
	  }

	  async deleteChatRoomByName(name: string): Promise<void> {
		await this.chatRepo.delete({ chatRoomName: name });
	  }

	  async deleteChatRoomById(id: string): Promise<void> {
		await this.chatRepo.delete({ id: id });
	  }
}
