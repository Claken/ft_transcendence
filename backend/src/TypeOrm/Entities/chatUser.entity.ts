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

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ default: false })
	isMute: boolean;

	@Column()
	timeMute: number;

	@Column({ default: false })
	isBan: boolean;

	@Column()
	timeBan: number;

	// @ManyToOne(() => ChatRoomEntity, Channel => Channel.members)
	// inChannel: ChatRoomEntity;
}