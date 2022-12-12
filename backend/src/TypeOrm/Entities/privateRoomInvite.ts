import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	  ManyToOne,
  } from 'typeorm';
  import { UsersEntity } from './users.entity';
  
  @Entity('PrivateRoomInvite')
  export class PrivateRoomInviteEntity {
	  @PrimaryGeneratedColumn()
	  id: number;
  
	  @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.privateRoomInvites)
	  sender: UsersEntity;
  
	  @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.privateRoomInvites)
	  receiver: UsersEntity;
  }
  
  export interface IPInvite {
	  id?: number;
	  sender: UsersEntity;
	  receiver: UsersEntity;
  }