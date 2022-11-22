import { DmEntity } from "./Entities/dm.entity";
import { UsersEntity } from "./Entities/users.entity";
import { Game } from "./Entities/game.entity";
import { ChatRoomEntity } from "./Entities/chat.entity";
import { MemberEntity } from "./Entities/member.entity";
import { MessageEntity } from "./Entities/chatMessage.entity";

export const entities = [ UsersEntity, DmEntity, Game, ChatRoomEntity, MemberEntity, MessageEntity];

export { UsersEntity, DmEntity, Game, ChatRoomEntity, MemberEntity, MessageEntity };
