import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ default: false })
  isFinish?: boolean;

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
