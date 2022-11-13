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

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	sender: string;

	@ManyToOne(() => ChatRoomEntity, (Channel: ChatRoomEntity) => Channel.messages, {onDelete: 'CASCADE'})
	channel: ChatRoomEntity;

	@Column()
	content: string;
	
  }