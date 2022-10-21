import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser, UsersEntity } from '../TypeOrm/Entities/users.entity';

@Injectable()
export class UsersService {
  // userRepo reflects the UsersEntity in database
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepo: Repository<UsersEntity>,
  ) {}

  // save() is a Repository Typeorm method to call INSERT query
  async create(user: IUser): Promise<UsersEntity> {
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

  async deleteUser(id: number): Promise<UsersEntity> {
    const user = await this.getById(id);
    return await this.userRepo.remove(user);
  }
}
