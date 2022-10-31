import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IMember, MemberEntity } from '../TypeOrm/Entities/member.entity'

import { CreateRoomDto } from '../TypeOrm/DTOs/chat.dto'
import { UsersService } from 'src/users/users.service';

// import { Repository } from 'typeorm'

@Injectable()
export class MemberService {
	constructor(
		@InjectRepository(MemberEntity)
		private readonly chatRepo: Repository<MemberEntity>,
	  	) {}

	  async createMember(chatRoom: IMember): Promise<MemberEntity> {
		
		const newMember = this.chatRepo.create(chatRoom);
		return this.chatRepo.save(chatRoom);
	  }
}