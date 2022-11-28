import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
} from 'typeorm';
import { UsersEntity } from "./users.entity"
import { UserDTO } from '../DTOs/User.dto';

@Entity()
export class Game implements IGame {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  loginLP?: string;

  @Column()
  loginRP?: string;

  @Column({ default: 0 })
  scoreLP?: number;

  @Column({ default: 0 })
  scoreRP?: number;

  @Column({ default: 10 })
  compteur?: number;

  @Column({ default: 0 })
  map?: number;

  @Column({ default: 0 })
  state?: number;

  @Column({ default: '' })
  winner?: string;

  @Column({ default: '' })
  loser?: string;

  @Column({ default: '' })
  abort?: string;

  @Column({ default: false })
  isFinish?: boolean;

  @Column({ default: true })
  waitingForOppenent?: boolean;

//   @ManyToOne(() => UsersEntity, User => User.games)
//   user: UsersEntity;

//   @ManyToOne(() => UsersEntity, User => User.userRight)
//   userRight: UsersEntity;

  @CreateDateColumn()
  date?: Date;
}

export interface IGame {
	id?: number;
	loginLP?: string;
	loginRP?: string;
	scoreLP?: number;
	scoreRP?: number;
	abort?: string;
	isFinish?: boolean;
	date?: Date;
}
