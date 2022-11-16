import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from 'src/TypeOrm';
import { Repository } from 'typeorm';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private avatar: Repository<Avatar>,
  ) {}

  async uploadAvatar(dataBuffer: Buffer, filename: string) {
    const newFile = this.avatar.create({
      filename,
      data: dataBuffer,
    });
    await this.avatar.save(newFile);
    return newFile;
  }

  async getFileById(fileId: number) {
    const file = await this.avatar.findOneBy({
        id: fileId
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}
