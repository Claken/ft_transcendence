import { DmEntity } from "./Entities/dm.entity";
import { UsersEntity } from "./Entities/users.entity";
import { Game } from "./Entities/game.entity";
import { FriendRequestEntity } from "./Entities/friendRequest.entity";
import { FriendEntity } from "./Entities/friend.entity";
import { BlockUserEntity } from "./Entities/blockUser.entity";

export const entities = [ UsersEntity, DmEntity, Game, FriendRequestEntity, FriendEntity, BlockUserEntity ];

export { UsersEntity, DmEntity, Game, FriendRequestEntity, FriendEntity, BlockUserEntity };
