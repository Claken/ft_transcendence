import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DmDto } from '../TypeOrm/DTOs/dm.dto';
import { DmEntity } from '../TypeOrm/Entities/dm.entity';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmEntity) private readonly dmRepo: Repository<DmEntity>,
  ) {}
  async newMessage(dm: DmDto): Promise<DmEntity> {
    const newDm = this.dmRepo.create(dm);
    return await this.dmRepo.save(newDm);
  }

	async historyDm(): Promise<DmEntity[]> {
    return await this.dmRepo.find();
  }
}
