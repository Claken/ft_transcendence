import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
} from 'typeorm';

@Entity()
export class Game implements IGame {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nameLP?: string;

  @Column()
  nameRP?: string;

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
  nbInter?: number;

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

  @Column({ default: false })
  waitingForInvit?: boolean;

  @CreateDateColumn()
  date?: Date;
}

export interface IGame {
	id?: number;
	loginLP?: string;
	nameLP?: string;
	loginRP?: string;
	nameRP?: string;
	scoreLP?: number;
	scoreRP?: number;
	compteur?: number;
	map?: number;
	state?: number;
	winner?: string;
	loser?: string;
	abort?: string;
	isFinish?: boolean;
	waitingForOppenent?: boolean;
	date?: Date;
}
