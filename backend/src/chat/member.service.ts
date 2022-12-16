import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IMember, MemberEntity } from '../TypeOrm/Entities/member.entity'
import { ChatRoomEntity } from 'src/TypeOrm';

import { ChatRoomDto } from '../TypeOrm/DTOs/chat.dto'
import { UsersService } from 'src/users/users.service';
import { DeepPartial } from 'typeorm';

@Injectable()
export class MemberService {
	constructor(
		@InjectRepository(MemberEntity)
		private readonly memberRepo: Repository<MemberEntity>,
	  	) {}

		async findAllMembers(): Promise<MemberEntity[]> {
			return await this.memberRepo.find({relations: ['inChannel', 'user']});
		}

		async findAllAdminsFromOneRoom(roomId: string) : Promise<MemberEntity[]> {
			return await this.memberRepo.find({relations: ['inChannel', 'user'], where: {inChannel: {id: roomId}, isAdmin: true}});
		}

		async findAllMembersFromOneRoom(roomId: string) : Promise<MemberEntity[]> {
			return await this.memberRepo.find({relations: ['inChannel', 'user'], where: {inChannel: {id: roomId}}});
		}

		async findAllBannedMembersFromOneRoom(roomId: string) :  Promise<MemberEntity[]> {
			return await this.memberRepo.find({relations: ['inChannel', 'user'], where: {inChannel: {id: roomId}, isBan: true}});
		}

		async findAllMutedMembersFromOneRoom(roomId: string) :  Promise<MemberEntity[]> {
			return await this.memberRepo.find({relations: ['inChannel', 'user'], where: {inChannel: {id: roomId}, isMute: true}});
		}

		async getMemberById(memberId: string) : Promise<MemberEntity> {
			return await this.memberRepo.findOne({where: {id: memberId}, relations: ['inChannel', 'user']});
		}

		async getMemberByName(memberName: string) : Promise<MemberEntity> {
			return await this.memberRepo.findOne({relations: ['inChannel', 'user'], where: {user: {name: memberName}}});
		}

		async getMemberByNameAndChannel(memberName: string, channel: ChatRoomEntity) : Promise<MemberEntity> {
			return await this.memberRepo.findOne({relations: ['inChannel', 'user'], where: {inChannel: {id: channel.id}, user: {name: memberName}}});
		}

		async createMember(member: IMember): Promise<MemberEntity> {
			return this.memberRepo.create(member);
		}

		async saveMember(member: MemberEntity) : Promise<MemberEntity> {
			return await this.memberRepo.save(member);
		}

		async updateMember(member: MemberEntity) : Promise<void> {
			await this.memberRepo.update(member.id, member);
		}

	  	async deleteMemberById(id: string) : Promise<void> {
			await this.memberRepo.delete({id: id});
		}
}