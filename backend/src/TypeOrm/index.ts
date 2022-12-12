import { DmEntity } from "./Entities/dm.entity";
import { UsersEntity } from "./Entities/users.entity";
import { Game } from "./Entities/game.entity";
import { ChatRoomEntity } from "./Entities/chat.entity";
import { MemberEntity } from "./Entities/member.entity";
import { MessageEntity } from "./Entities/chatMessage.entity";
import { Avatar } from "./Entities/avatar.entity";
import { FriendRequestEntity } from "./Entities/friendRequest.entity";
import { FriendEntity } from "./Entities/friend.entity";
import { BlockUserEntity } from "./Entities/blockUser.entity";
import { PrivateRoomInviteEntity } from "./Entities/privateRoomInvite";

export const entities = [ UsersEntity, DmEntity, Game, ChatRoomEntity, MemberEntity, MessageEntity, Avatar, FriendRequestEntity, FriendEntity, BlockUserEntity, PrivateRoomInviteEntity];

export { UsersEntity, DmEntity, Game, ChatRoomEntity, MemberEntity, MessageEntity, Avatar, FriendRequestEntity, FriendEntity, BlockUserEntity, PrivateRoomInviteEntity };
