import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Dm')
export class DmEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text" })	
  sender: string;

	@Column({ type: "text" })
  receiver: string;

	@Column({ type: "text" })
  message: string;

	@Column()
	read: boolean;
}
