import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	OneToMany
} from 'typeorm';
import { ChatUserEntity } from './chatUser.entity';
import { UsersEntity } from './users.entity';

@Entity('ChatRoom')
export class ChatRoomEntity {

	@PrimaryGeneratedColumn()
	id?: number;

	@Column({unique: true})
	chatRoomName: string;
  
	@ManyToOne(() => UsersEntity, User => User.ownedChannels)
	owner?: UsersEntity;
  
	@Column()
	administrators?: string;

	// @OneToMany(()=> ChatUserEntity, Member => Member.inChannel)
	// members: ChatUserEntity;

	@Column({ default: true })
	isPublic: boolean;

	@Column({ default: ''})
	password?: string;

	@CreateDateColumn()
	createdAt?: Date;

	@Column()
	messages: string;
}