import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IMember, MemberEntity } from '../TypeOrm/Entities/member.entity'

import { CreateRoomDto } from '../TypeOrm/DTOs/chat.dto'
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MemberService {
	constructor(
		@InjectRepository(MemberEntity)
		private readonly memberRepo: Repository<MemberEntity>,
	  	) {}

		async findAllMembers(): Promise<MemberEntity[]> {
			return await this.memberRepo.find({relations: ['inChannel']});
		} 

		async getMemberById(memberId: string) : Promise<MemberEntity> {
			return await this.memberRepo.findOneBy({id: memberId});
		}

		async getMemberByName(memberName: string) : Promise<MemberEntity> {
			return await this.memberRepo.findOneBy({name: memberName});
		}

		async createMember(member: IMember): Promise<MemberEntity> {
			return this.memberRepo.create(member);
		}

		async saveMember(member: MemberEntity) : Promise<MemberEntity> {
			return await this.memberRepo.save(member);
		}

		async updateMember(id: string): Promise<MemberEntity> {
			const member = await this.getMemberById(id);
			return await this.memberRepo.save(member);
		}

	  	async deleteMemberByNameInChannel(name: string, roomId: string) : Promise<void> {
			const member = await this.memberRepo.findOne({where: {name: name, inChannelId: roomId}, relations: ['inChannel']})
			await this.memberRepo.delete({member});

		}

		async deleteMemberById(id: string) : Promise<void> {
			await this.memberRepo.delete({id: id});
		}
}