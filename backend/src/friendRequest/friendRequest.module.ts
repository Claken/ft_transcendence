import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestController } from './friendRequest.controller';
import { FriendRequestEntity } from '../TypeOrm/Entities/friendRequest.entity';
import { FriendRequestService } from './friendRequest.service';
import { FriendRequestGateway } from './friendRequest.gateway';
import { UsersModule } from 'src/users/users.module';
import { DmModule } from 'src/dm/dm.module';
import { FriendEntity } from 'src/TypeOrm';

@Module({
	imports: [TypeOrmModule.forFeature([FriendRequestEntity, FriendEntity]), UsersModule, DmModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, FriendRequestGateway],
	exports: [FriendRequestService],
})
export class FriendRequestModule {}
