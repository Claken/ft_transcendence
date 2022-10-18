import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity()
export class ChatRoomEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	chatRoomName: string;
  
	@ManyToOne(() => UsersEntity, User => User.ownChannel)
	owner: UsersEntity;
  
	@Column()
	administrators: string[];

	@Column({ default: true })
	isPublic: boolean;

	@Column({ default: ''})
	password: string;

	@CreateDateColumn()
	createdAt: Date;
}

export interface IChatRoom {
	id: number;
	chatRoomName: string;
	owner: UsersEntity;
	administrators: string[];
	isPublic: boolean;
	password?: string;
	createdAt: Date;
}