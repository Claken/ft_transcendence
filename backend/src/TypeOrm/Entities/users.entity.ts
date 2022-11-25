import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Avatar } from './avatar.entity';
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
