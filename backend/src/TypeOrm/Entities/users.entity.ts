import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoomEntity } from './chat.entity';

// Table in the DB
@Entity('Users')
export class UsersEntity {
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

  @OneToMany(() => ChatRoomEntity, Channel => Channel.owner)
  ownChannel: ChatRoomEntity[];

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
