import { ISession } from 'connect-typeorm/out';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'Sessions' })
export class UserSession implements ISession {
  @Index()
  @Column('bigint')
  public expiredAt: number = Date.now();

  @PrimaryColumn('varchar', { length: 255 })
  public id: string = '';

  @Column('text')
  public json: string = '';

  @DeleteDateColumn()
  public destroyedAt?: Date;
}
