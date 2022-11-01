import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	OneToMany,
	JoinTable
} from 'typeorm';
import { MemberEntity } from './member.entity';
import { UsersEntity } from './users.entity';

@Entity('ChatRoom')
export class ChatRoomEntity {

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true})
	chatRoomName?: string;
  
	@ManyToOne(() => UsersEntity, (User: UsersEntity) => User.ownedChannels)
	owner?: UsersEntity;
  
	@Column()
	administrators?: string;

	// @OneToMany(()=> MemberEntity, (Member: MemberEntity) => Member.inChannel)
	// members: MemberEntity[];

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
	// members?: MemberEntity[];
	isPublic?: boolean,
	password?: string,
	createdAt?: Date,
}