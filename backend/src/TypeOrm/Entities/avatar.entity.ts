import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity()
export class Avatar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({
    nullable: true,
    type: 'bytea',
  })
  data: Uint8Array;

  @OneToOne(() => UsersEntity, (user) => user.avatar, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  user?: UsersEntity;
}
