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
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: '' })
  login?: string;

  @Column({ default: '', unique: true })
  name?: string;

  @Column({ default: '' })
  email?: string;

  @Column({ default: '' })
  pictureUrl?: string;

  @Column({ default: 'online' })
  status?: string;

  @CreateDateColumn()
  createdAt?: Date;
}
