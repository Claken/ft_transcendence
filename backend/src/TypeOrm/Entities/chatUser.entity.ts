import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne
} from 'typeorm';
import { ChatRoomEntity } from './chat.entity';

@Entity('ChatUser')
export class ChatUserEntity {

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ default: false })
	isMute: boolean;

	@Column()
	timeMute?: number;

	@Column({ default: false })
	isBan: boolean;

	@Column()
	timeBan?: number;

	@ManyToOne(() => ChatRoomEntity, (Channel: ChatRoomEntity) => Channel.members)
	inChannel?: ChatRoomEntity;
}

export interface IChatUser {
	id?: string,
	name?: string,
	isMute?: boolean,
	timeMute?: number,
	isBan?: boolean,
	timeBan?: number,
	inChannel?: ChatRoomEntity;
}