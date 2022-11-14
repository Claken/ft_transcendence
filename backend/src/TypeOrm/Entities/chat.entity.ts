import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	OneToMany,
	JoinTable,
	JoinColumn
} from 'typeorm';
import { MemberEntity } from './member.entity';
import { MessageEntity } from './chatMessage.entity';
import { UsersEntity } from './users.entity';

@Entity('ChatRoom')
export class ChatRoomEntity {

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true})
	chatRoomName?: string;
  
	@ManyToOne(() => UsersEntity, (User: UsersEntity) => User.ownedChannels)
	owner?: UsersEntity;

	@OneToMany(()=> MemberEntity, (Member: MemberEntity) => Member.inChannel, {nullable: true, cascade: true})
	@JoinColumn() // permet de dire où se trouve l'id des members. Ici; il se trouve dans l'entité Member. Ainsi, on va avoir une colonne MembersId dans notre table
	members: MemberEntity[];

	@OneToMany(() => MessageEntity, (Message: MessageEntity) => Message.channel, {nullable: true, cascade: true})
	@JoinColumn()
	messages: MessageEntity[];

	@Column({ default: true })
	isPublic: boolean;

	@Column({ nullable: true, default: ''})
	password?: string;

	@CreateDateColumn()
	createdAt?: Date;
}

export interface IChatRoom {
	id?: string,
	chatRoomName?: string,
	owner?: UsersEntity,
	members?: MemberEntity[];
	messages?: MessageEntity[];
	isPublic?: boolean,
	password?: string,
	createdAt?: Date,
}