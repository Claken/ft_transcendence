import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';
import { Avatar } from './avatar.entity';
import { ChatRoomEntity } from './chat.entity';
import { Socket } from './sockets.entity';

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

  @Column({ default: 'online' })
  status?: string;

  @Column({ default: '' })
  twoFASecret?: string;

  @Column({ default: false })
  isTwoFAEnabled?: boolean;

  @Column({ default: false })
  isTwoFAValidated?: boolean;

  @Column({ default: false })
  inQueue?: boolean;

  @Column({ default: false })
  inGame?: boolean;

  @Column({ nullable: true, default: 0})
  win?: number;

  @Column({ nullable: true, default: 0})
  lose?: number;

  @OneToMany(() => ChatRoomEntity, (Chat: ChatRoomEntity) => Chat.owner, {onDelete: 'SET NULL'})
  @JoinColumn()
  ownedChannels?: ChatRoomEntity[];

  @OneToMany(() => Socket, socket => socket.user)
  socket: Socket[];

  @Column({ default: false })
  lastSocket?: string;

  @Column({ nullable: true, default: 0 })
  avatarId?: number;
  
  @OneToOne(() => Avatar, (avatar) => avatar.user, {
    cascade: true
  })
  avatar?: Avatar;

  // TODO: friends
  // @OneToMany(() => UsersEntity, (friends) => friends.id, {
  //   onDelete: 'SET NULL',
  // })
  // friends: UsersEntity[];

}
