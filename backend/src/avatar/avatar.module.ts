import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from 'src/TypeOrm';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar]), forwardRef(() => UsersModule)],
  providers: [AvatarService],
  exports: [AvatarService],
  controllers: [AvatarController],
})
export class AvatarModule {}
