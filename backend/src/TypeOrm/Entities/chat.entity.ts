import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn
} from 'typeorm';

@Entity()
export class ChatRoomEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	chatRoomName: string;
  
	@Column()
	owner: string;
  
	@Column()
	administrator: string;

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
	owner: string;
	administrator: string;
	isPublic: boolean;
	password?: string;
	createdAt: Date;
}