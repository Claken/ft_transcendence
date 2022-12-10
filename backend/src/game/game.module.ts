import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from "./game.gateway";
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game } from 'src/TypeOrm/Entities/game.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersEntity } from 'src/TypeOrm';

@Module({
  providers: [GameGateway, GameService],
  controllers: [GameController],
  imports: [UsersModule, UsersEntity, TypeOrmModule.forFeature([Game])],
  exports: [GameService],
})
export class GameModule {}
