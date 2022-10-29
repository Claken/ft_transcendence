import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Table in the DB
@Entity('Users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: '' })
  login?: string;

  @Column({ default: '', unique: true })
  name?: string;

  @Column({ default: '' })
  email?: string;

  @Column({ default: '' })
  pictureUrl?: string;

  @Column({ default: 'online' })
  status?: string;

  @Column({ nullable :true })
  hashTwoFASecret?: string;

  @Column({ default: false })
  isTwoFAEnabled?: boolean;

  @CreateDateColumn()
  createdAt?: Date;
}
