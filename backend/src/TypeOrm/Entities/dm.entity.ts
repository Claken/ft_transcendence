import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
	CreateDateColumn,
} from 'typeorm';

@Entity('Dm')
export class DmEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text" })	
  sender: string;

	@Column({ type: "text" })
  receiver: string;

	@Column({ nullable: true, default: 0 })
	senderId: number;

	@Column({ nullable: true, default: 0 })
	receiverId: number;

	@Column({ type: "text" })
  message: string;

	@Column()
	read: boolean;

	@CreateDateColumn()
	date: Date
}
