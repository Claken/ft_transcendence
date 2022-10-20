export interface IChatRoom {
	chatRoomName: string;
	ownerLogin?: string;
	ownerId?: number;
	administratorLogin?: string;
	isPublic: boolean;
	password?: string;
}