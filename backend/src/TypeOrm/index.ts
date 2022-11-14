import { UsersEntity } from "./Entities/users.entity";
import { ChatRoomEntity } from "./Entities/chat.entity";
import { MemberEntity } from "./Entities/member.entity";
import { MessageEntity } from "./Entities/chatMessage.entity";

export const entities = [ UsersEntity, ChatRoomEntity, MemberEntity, MessageEntity ];

export { UsersEntity, ChatRoomEntity, MemberEntity, MessageEntity };