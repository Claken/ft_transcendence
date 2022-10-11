import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from "./users.entity"

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

  @Column({ default: '' })
  winner?: string;

  @Column({ default: '' })
  loser?: string;

  @Column({ default: '' })
  abort?: string;

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
	date?: Date;
}