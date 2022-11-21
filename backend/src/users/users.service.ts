import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { Repository } from 'typeorm';
import { UsersEntity } from '../TypeOrm/Entities/users.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  // userRepo reflects the UsersEntity in database
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepo: Repository<UsersEntity>,
  ) {}

  // save() is a Repository Typeorm method to call INSERT query
  // TODO: handle users already exist
  async create(user: UserDTO): Promise<UsersEntity> {
      const newUser = this.userRepo.create(user);
      return await this.userRepo.save(newUser);
  }

  // find() is a Repository Typeorm method to call SELECT query
  // TODO: throw exception if not found ?
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.userRepo.find();
  }

  async getByName(nameToFind: string): Promise<UsersEntity> {
    return await this.userRepo.findOneBy({
      name: nameToFind,
    });
  }

  async getById(idToFind: number): Promise<UsersEntity> {
    return await this.userRepo.findOneBy({
      id: idToFind,
    });
  }

  async updateStatusUser(id: number, status: string): Promise<UsersEntity> {
    const user = await this.getById(id);
    user.status = status;
    return await this.userRepo.save(user);
  }

  async updateInQueue(id: number, bool: boolean): Promise<UsersEntity> {
    const user = await this.getById(id);
    user.inQueue = bool;
    return await this.userRepo.save(user);
  }

  async updateInGame(id: number, bool: boolean): Promise<UsersEntity> {
    const user = await this.getById(id);
    user.inGame = bool;
    return await this.userRepo.save(user);
  }

  async OneMoreWin(id: number): Promise<UsersEntity> {
    const user = await this.getById(id);
	user.win += 1;
    return await this.userRepo.save(user);
  }

  async OneMorelose(id: number): Promise<UsersEntity> {
    const user = await this.getById(id);
	user.lose += 1;
    return await this.userRepo.save(user);
  }

  async deleteUser(id: number): Promise<UsersEntity> {
    const user = await this.getById(id);
    return await this.userRepo.remove(user);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async removeGuestUsers(): Promise<UsersEntity[]> {
    const guestUsers = await this.userRepo.findBy({
      login: '',
    });
    if (!guestUsers) return [];
    return await this.userRepo.remove(guestUsers);
  }

  async setTwoFASecret(secret: string, id: number): Promise<UsersEntity> {
    const user = await this.getById(id);
    user.twoFASecret = secret;
    return await this.userRepo.save(user);
  }

  async turnOnOffTwoFA(id: number): Promise<UsersEntity> {
    const user = await this.getById(id);
    user.isTwoFAEnabled = !user.isTwoFAEnabled;
    return await this.userRepo.save(user);
  }

  async setTwoFACertif(id: number, val: boolean): Promise<UsersEntity> {
    const user = await this.getById(id);
    user.isTwoFAValidated = val;
    return await this.userRepo.save(user);
  }
}
