import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from 'src/TypeOrm';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private avatarRepo: Repository<Avatar>,
  ) {}

  async uploadAvatar(dataBuffer: Buffer, filename: string): Promise<Avatar> {
    const newAvatar = this.avatarRepo.create({
      filename,
      data: dataBuffer,
    });
    await this.avatarRepo.save(newAvatar);
    return newAvatar;
  }

  async deleteAvatar(
    avatarId: number,
  ) {
    const avatar = await this.getFileById(avatarId);
    return await this.avatarRepo.remove(avatar);
  }

  async uploadAvatarWithQueryRunner(
    dataBuffer: Buffer,
    filename: string,
    queryrunner: QueryRunner,
  ): Promise<Avatar> {
    const newAvatar = queryrunner.manager.create(Avatar, {
      filename,
      data: dataBuffer,
    });
    await queryrunner.manager.save(newAvatar);
    return newAvatar;
  }

  async deleteAvatarWithQueryRunner(
    avatarId: number,
    queryRunner: QueryRunner,
  ) {
    const deleteResponse = await queryRunner.manager.delete(Avatar, avatarId);
    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }

  async getFileById(fileId: number): Promise<Avatar> {
    const file = await this.avatarRepo.findOneBy({
      id: fileId,
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}
