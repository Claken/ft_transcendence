export interface IChatRoom {
	id?: number;

	chatRoomName?: string;
  
	// @ManyToOne(() => UsersEntity, User => User.ownedChannels)
	// owner?: UsersEntity;
	owner?: string;
  
	administrators?: string;

	// @OneToMany(()=> ChatUserEntity, Member => Member.inChannel)
	// members: ChatUserEntity;

	isPublic: boolean;

	password?: string;

	createdAt?: Date;
}