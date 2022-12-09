import { Module } from '@nestjs/common';
import { DmGateway } from './dm.gateway';
import { DmService } from './dm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmEntity } from '../TypeOrm/Entities/dm.entity';
import { DmController } from './dm.controller';
import { DmUser } from './dm.service';

@Module({
  imports: [TypeOrmModule.forFeature([DmEntity])],
  controllers: [DmController],
  providers: [DmService, DmGateway, Array<DmUser>],
	exports: [DmService],
})
export class DmModule {}
