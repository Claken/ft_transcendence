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

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true})
	chatRoomName?: string;
  
	@ManyToOne(() => UsersEntity, (User: UsersEntity) => User.ownedChannels)
	owner?: UsersEntity;
	// @Column()
	// owner?: string;
  
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
}

export interface IChatRoom {
	id?: string,
	chatRoomName?: string,
	owner?: UsersEntity,
	administrators?: string,
	isPublic?: boolean,
	password?: string,
	createdAt?: Date,
}