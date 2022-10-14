import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';

// Table in the DB
@Entity('Users')
export class Users implements IUser {
  @PrimaryGeneratedColumn()
  id?: number;

  // tofix: authService return newDefaultUser
  @Column({ default: '', unique: true })
  login: string;

  @Column({ default: '', unique: true })
  name?: string;

  @Column({ default: '' })
  email?: string;

  @Column({ default: '' })
  pictureUrl?: string;

  @CreateDateColumn()
  createdAt?: Date;
}

export interface IUser {
  id?: number;
  login: string;
  name?: string;
  email?: string;
  pictureUrl?: string;
  createdAt?: Date;
}
