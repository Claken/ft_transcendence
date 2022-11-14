import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IChatMessage, MessageEntity } from 'src/TypeOrm/Entities/chatMessage.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepo: Repository<MessageEntity>,
	  	) {}

        async createMessage(message: IChatMessage) : Promise<MessageEntity> {
            return await this.messageRepo.create(message);
        }
    }