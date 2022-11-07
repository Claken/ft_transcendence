import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	onDelete,
} from 'typeorm';
import { ChatRoomEntity } from './chat.entity';

@Entity('Member')
export class MemberEntity {

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ default: false })
	isMute: boolean;

	@Column({ nullable: true, default: 0 })
	timeMute?: number;

	@Column({ default: false })
	isBan: boolean;

	@Column({ nullable: true, default: 0 })
	timeBan?: number;

	@ManyToOne(() => ChatRoomEntity, (Channel: ChatRoomEntity) => Channel.members, {onDelete: 'CASCADE'})
	inChannel?: ChatRoomEntity;
}

export interface IMember {
	id?: string,
	name?: string,
	isMute?: boolean,
	timeMute?: number,
	isBan?: boolean,
	timeBan?: number,
	inChannel?: ChatRoomEntity;
}