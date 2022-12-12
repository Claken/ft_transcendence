import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestController } from './friendRequest.controller';
import { FriendRequestEntity } from '../TypeOrm/Entities/friendRequest.entity';
import { FriendRequestService } from './friendRequest.service';
import { FriendRequestGateway } from './friendRequest.gateway';
import { UsersModule } from 'src/users/users.module';
import { DmModule } from 'src/dm/dm.module';
import { FriendEntity, PrivateRoomInviteEntity } from 'src/TypeOrm';
import { PrivateRoomInviteService } from './privateRoomInvite.service';

@Module({
	imports: [TypeOrmModule.forFeature([FriendRequestEntity, FriendEntity, PrivateRoomInviteEntity]), UsersModule, DmModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, FriendRequestGateway, PrivateRoomInviteService],
	exports: [FriendRequestService],
})
export class FriendRequestModule {}
