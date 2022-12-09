import {
  Entity,
  PrimaryGeneratedColumn,
	ManyToOne,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('Friend')
export class FriendEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UsersEntity, (user: UsersEntity) => user.friends)
	user: UsersEntity;

	@ManyToOne(() => UsersEntity, (user: UsersEntity) => user.friends)
	friendOf: UsersEntity;
}

export interface IFriend {
	id?: number;

	user: UsersEntity;

	friendOf: UsersEntity;
}