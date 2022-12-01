import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity("sockets")
export class Socket implements ISocket {
    @PrimaryGeneratedColumn({ name: 'socket_no'})
    id: number;

    @Column()
    name: string;

    @Column()
    idUser : number;

    @ManyToOne(() => UsersEntity, user => user.socket)
    user : UsersEntity;
}

export interface ISocket {
        name: string;
        user: UsersEntity;
        idUser : number;
    }
