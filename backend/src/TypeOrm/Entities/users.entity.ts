import {
  Column,
  Entity,
	OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
	CreateDateColumn
} from 'typeorm';
import { Avatar } from './avatar.entity';
import { ChatRoomEntity } from './chat.entity';
import { MemberEntity } from './member.entity';
import { FriendRequestEntity } from './friendRequest.entity';
import { FriendEntity } from './friend.entity';
import { BlockUserEntity } from './blockUser.entity';
import { PrivateRoomInviteEntity } from './privateRoomInvite'

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

  @Column({ default: false })
  hasSentAnInvite?: boolean;

  @Column({ nullable: true, default: 0})
  win?: number;

  @Column({ nullable: true, default: 0})
  lose?: number;

  @OneToMany(() => ChatRoomEntity, (Chat: ChatRoomEntity) => Chat.owner, {onDelete: 'SET NULL'})
  @JoinColumn()
  ownedChannels?: ChatRoomEntity[];

  @Column({ default: false })
  lastSocket?: string;

  @Column({ nullable: true, default: 0 })
  avatarId?: number;
  
  @OneToOne(() => Avatar, (avatar) => avatar.user, {
    cascade: true
  })
  avatar?: Avatar;

  @OneToMany(() => MemberEntity, (Member: MemberEntity) => Member.user, {onDelete: 'SET NULL'})
  @JoinColumn()
  memberships?: MemberEntity[];

	@OneToMany(() => FriendRequestEntity, (friendRequest: FriendRequestEntity) => friendRequest.sender && friendRequest.receiver)
	@JoinColumn()
	friendRequests: FriendRequestEntity[];

  @OneToMany(() => PrivateRoomInviteEntity, (privateInvite: PrivateRoomInviteEntity) => privateInvite.sender && privateInvite.receiver)
	@JoinColumn()
	privateRoomInvites: PrivateRoomInviteEntity[];

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
