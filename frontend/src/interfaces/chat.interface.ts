export interface IChatRoom {
	id?: number;

	chatRoomName?: string;

	owner?: string;
  
	administrators?: string;

	isPublic: boolean;

	password?: string;

	createdAt?: Date;
}