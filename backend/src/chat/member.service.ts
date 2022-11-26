import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IMember, MemberEntity } from '../TypeOrm/Entities/member.entity'
import { ChatRoomEntity } from 'src/TypeOrm';

import { ChatRoomDto } from '../TypeOrm/DTOs/chat.dto'
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

		async findAllAdminsFromOneRoom(roomId: string) : Promise<MemberEntity[]> {
			const members = await this.findAllMembers();
			return members.filter((member: MemberEntity) =>
			member.inChannel.id === roomId && member.isAdmin === true);
		}

		async findAllMembersFromOneRoom(roomId: string) : Promise<MemberEntity[]> {
			const members = await this.findAllMembers();
			const membersFromOneRoom = members.filter((member: MemberEntity) => member.inChannel.id === roomId);
			return membersFromOneRoom;
		}

		async findAllBannedMembersFromOneRoom(roomId: string) :  Promise<MemberEntity[]> {
			const members = await this.findAllMembers();
			return members.filter((member: MemberEntity) => member.inChannel.id === roomId && member.isBan === true);
		}

		async getMemberById(memberId: string) : Promise<MemberEntity> {
			return await this.memberRepo.findOne({where: {id: memberId}, relations: ['inChannel']});
		}

		async getMemberByName(memberName: string) : Promise<MemberEntity> {
			return await this.memberRepo.findOne({where: {name: memberName}, relations: ['inChannel']});
		}

		async getMemberByNameAndChannel(memberName: string, channel: ChatRoomEntity) : Promise<MemberEntity> {
			const members = await this.findAllMembers();
			return members.find((member: MemberEntity) =>
			member.name === memberName && member.inChannel.id === channel.id);
		}

		async createMember(member: IMember): Promise<MemberEntity> {
			return this.memberRepo.create(member);
		}

		async saveMember(member: MemberEntity) : Promise<MemberEntity> {
			return await this.memberRepo.save(member);
		}

		async updateMemberIsAdminToTrue(memberId: string) : Promise<void> {
			let member = await this.getMemberById(memberId);
			member.isAdmin = true;
			await this.memberRepo.update(member.id, member);
		}

	  	async deleteMemberById(id: string) : Promise<void> {
			await this.memberRepo.delete({id: id});
		}
}