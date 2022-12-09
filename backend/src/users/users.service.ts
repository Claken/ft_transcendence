import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { Repository } from 'typeorm';
import { UsersEntity } from '../TypeOrm/Entities/users.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FriendEntity } from 'src/TypeOrm';

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

  async getByNameWithRelations(nameToFind: string): Promise<UsersEntity> {
    return await this.userRepo.findOne({
      where: { name: nameToFind }, relations: ['friendRequests', 'friends', 'friends.user', 'blockUsers', 'blockUsers.user', 'blockBys', 'blockBys.user']
    });
  }

	async getByIdWithRelations(idToFind: number): Promise<UsersEntity> {
    return await this.userRepo.findOne({
      where: { id: idToFind }, relations: ['friendRequests', 'friends', 'friends.user', 'blockUsers', 'blockUsers.user', 'blockBys', 'blockBys.user']
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

	async save(tosave: Promise<UsersEntity>): Promise<UsersEntity> {
		return this.userRepo.save(await tosave);
	}

	async getFriends(name: string): Promise<UsersEntity[] | undefined> {
		const friends: UsersEntity[] = [];
		const user = await this.userRepo.findOne({
      where: { name: name }, relations: ['friends', 'friends.user']
    });
		if (user && user.friends) {
			user.friends.map(friend => friends.push(friend.user));
			return friends;
		}
		else
			return undefined;
	}
}
