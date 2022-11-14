import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	JoinColumn,
	ManyToOne
  } from 'typeorm';
  import { ChatRoomEntity } from './chat.entity';

  @Entity('Message')
  export class MessageEntity {

	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	sender: string;

	@ManyToOne(() => ChatRoomEntity, (Channel: ChatRoomEntity) => Channel.messages, {onDelete: 'CASCADE'})
	channel?: ChatRoomEntity;

	@Column()
	content: string;

	@CreateDateColumn()
	createdAt?: Date;
  }

  export interface IChatMessage {
	id?: number,
	sender?: string,
	channel?: ChatRoomEntity,
	content?: string,
	createdAt?: Date,
}