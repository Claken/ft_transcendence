import { UsersModule } from 'src/users/users.module';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
} from 'typeorm';
import { ChatRoomEntity } from './chat.entity';
import { UsersEntity } from './users.entity';

@Entity('Member')
export class MemberEntity {

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => UsersEntity, (user: UsersEntity) => user.memberships, {onDelete: 'CASCADE'})
	user?: UsersEntity;

	@Column({ default: false })
	isAdmin: boolean;

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

	@CreateDateColumn()
	createdAt?: Date;
}

export interface IMember {
	id?: string,
	name?: string,
	user?: UsersEntity,
	isAdmin?: boolean,
	isMute?: boolean,
	timeMute?: number,
	isBan?: boolean,
	timeBan?: number,
	inChannel?: ChatRoomEntity;
	createdAt?: Date;
}