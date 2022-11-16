import { Module } from '@nestjs/common';
import { DmGateway } from './dm.gateway';
import { DmService } from './dm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmEntity } from '../TypeOrm/Entities/dm.entity';
import { DmController } from './dm.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DmEntity])],
  controllers: [DmController],
  providers: [DmService, DmGateway],
})
export class DmModule {}
