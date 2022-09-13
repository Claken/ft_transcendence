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
  
  // tofix: authService return newDefaultUser 
  @Column({ default: '', unique: true }) 
  username: string;

  @Column({ default: '' })
  emails?: string;

  @Column({ default: '' })
  profileUrl: string;

  // @Column()
  // accessToken?: string;

  @CreateDateColumn()
  createdAt: Date;
}
