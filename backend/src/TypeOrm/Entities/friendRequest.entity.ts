import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
	ManyToOne,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('FriendRequest')
export class FriendRequestEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UsersEntity, (user: UsersEntity) => user.friendRequests)
	sender: UsersEntity;

	@ManyToOne(() => UsersEntity, (user: UsersEntity) => user.friendRequests)
	receiver: UsersEntity;
}

export interface IFriendRequest {
	id?: number;

	sender: UsersEntity;

	receiver: UsersEntity;
}