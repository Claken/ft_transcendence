import {
  Column,
  CreateDateColumn,
  Entity,
	ManyToOne,
  OneToMany,
	JoinTable,
	JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendRequestEntity } from './friendRequest.entity';
import { FriendEntity } from './friend.entity';
import { BlockUserEntity } from './blockUser.entity';

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

	@OneToMany(() => FriendRequestEntity, (friendRequest: FriendRequestEntity) => friendRequest.sender && friendRequest.receiver)
	@JoinColumn()
	friendRequests: FriendRequestEntity[];

	@OneToMany(() => FriendEntity, (friend: FriendEntity) => friend.friendOf)
	@JoinColumn()
  friends: FriendEntity[];

	@OneToMany(() => BlockUserEntity, (blockUser: BlockUserEntity) => blockUser.blockBy)
	@JoinColumn()
  blockUsers: BlockUserEntity[];

	@OneToMany(() => BlockUserEntity, (blockUser: BlockUserEntity) => blockUser.user)
	@JoinColumn()
	blockBys: BlockUserEntity[];

  @CreateDateColumn()
  createdAt?: Date;
}
