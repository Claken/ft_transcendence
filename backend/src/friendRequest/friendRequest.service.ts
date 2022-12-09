import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from 'src/TypeOrm';
import { IFriend } from 'src/TypeOrm/Entities/friend.entity';
import { Repository } from 'typeorm';
import { FriendRequestEntity, IFriendRequest } from "../TypeOrm/Entities/friendRequest.entity";

@Injectable()
export class FriendRequestService {
  constructor(
  @InjectRepository(FriendRequestEntity)
	private readonly friendRequestRepo: Repository<FriendRequestEntity>,
	@InjectRepository(FriendEntity)
	private readonly friendRepo: Repository<FriendEntity>,
	) {}

	async getAllFriendRequests(): Promise<FriendRequestEntity[]> {
		return await this.friendRequestRepo.find({relations: ['sender', 'receiver']});
	}

	async getFriendRequestsOfOne(id: number): Promise<FriendRequestEntity[]> {
		return await this.friendRequestRepo.find({
			relations: [
				'sender', 
				'receiver',
			],
			where: [
				{ receiver: { id: id }},
			]
		});
	}

	async getFriendRequestByUserId(senderId: number, receiverId: number): Promise<FriendRequestEntity> {
		return await this.friendRequestRepo.findOne({
			relations: [
				'sender', 
				'receiver',
			],
			where: [
				{ sender: { id: senderId }, receiver: { id: receiverId }}
			]
		});
	}
	
	async postFriendRequest(friendRequest: IFriendRequest): Promise<FriendRequestEntity> {
		const newFriendRequest = this.friendRequestRepo.create(friendRequest);
    return await this.friendRequestRepo.save(newFriendRequest);
	}

	async alreadyExist(senderId: number, receiverId: number): Promise<FriendRequestEntity | undefined> {
		const test = this.friendRequestRepo.findOne({
			relations: [
				'sender',
				'receiver',
			],
			where: [
				{ sender: { id: senderId }, receiver: { id: receiverId }},
				{ sender: { id: receiverId }, receiver: { id: senderId }},
			],
		})
		if ((await test))
			return test;
		else
			return undefined;
	}

	async remove(toDelete: FriendRequestEntity): Promise<FriendRequestEntity> {
		return await this.friendRequestRepo.remove(toDelete);
	}

	async createNewFriend(friend: IFriend): Promise<FriendEntity> {
		const exist = this.friendRepo.findOne({
			relations: ['user'],
			where: { user: { id: friend.user.id }, friendOf: { id: friend.friendOf.id }}
		});
		if (await exist)
			return exist;
		else {
			const newFriend = this.friendRepo.create(friend);
    	return await this.friendRepo.save(newFriend);
		}
	}

	async deleteFriend(toDelete: FriendEntity) {
		return await this.friendRepo.remove(toDelete);
	}
}