import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable
} from 'typeorm';
import { ChatRoomEntity } from './chat.entity';

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

  @OneToMany(() => ChatRoomEntity, Chat => Chat.owner)
  ownedChannels?: ChatRoomEntity[];

  @CreateDateColumn()
  createdAt?: Date;
}
