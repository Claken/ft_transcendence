import {
  Entity,
  PrimaryGeneratedColumn,
	ManyToOne,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('BlockUser')
export class BlockUserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UsersEntity, (user: UsersEntity) => user.blockUsers)
	user: UsersEntity;

	@ManyToOne(() => UsersEntity, (user: UsersEntity) => user.blockBys)
	blockBy: UsersEntity;
}

export interface IBlockUser {
	id?: number;

	user: UsersEntity;

	blockBy: UsersEntity;
}