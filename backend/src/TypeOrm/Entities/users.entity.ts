import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';
import { Game } from './game.entity';
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
  avatar?: string;

  @Column({ default: 'online' })
  status?: string;

  @Column({ default: '' })
  twoFASecret?: string;

  @Column({ default: false })
  isTwoFAEnabled?: boolean;

  @Column({ default: false })
  isTwoFAValidated?: boolean;

  @Column({ default: false })
  inQueue: boolean;

  @Column({ default: false })
  inGame: boolean;
  @Column({ nullable: true, default: 0})
  win?: number;

  @Column({ nullable: true, default: 0})
  lose?: number;

  @OneToMany(() => ChatRoomEntity, (Chat: ChatRoomEntity) => Chat.owner, {onDelete: 'SET NULL'})
  @JoinColumn()
  ownedChannels?: ChatRoomEntity[];
//   @OneToMany(() => Game, Game => Game.userLeft)
//   userLeft: Game[];

//   @OneToMany(() => Game, Game => Game.userRight)
//   userRight: Game[];

  @CreateDateColumn()
  createdAt?: Date;
}
