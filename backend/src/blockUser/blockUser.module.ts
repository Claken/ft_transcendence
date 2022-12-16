import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockUserEntity } from '../TypeOrm/Entities/blockUser.entity';
import { BlockUserService } from './blockUser.service';
import { BlockUserGateway } from './blockUser.gateway';
import { UsersModule } from 'src/users/users.module';
import { BlockUserController } from './blockUser.controller';
import { DmModule } from 'src/dm/dm.module';
import { FriendRequestModule } from 'src/friendRequest/friendRequest.module';

@Module({
	imports: [TypeOrmModule.forFeature([BlockUserEntity]), UsersModule, DmModule, FriendRequestModule],
  controllers: [BlockUserController],
  providers: [BlockUserService, BlockUserGateway],
	exports: [BlockUserService],
})
export class BlockUserModule {}