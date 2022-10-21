/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IUser, UsersEntity } from '../TypeOrm/Entities/users.entity';

@Injectable()
export class UsersService {
  // We inject the UsersRepository(Entity) into the UsersService using the @InjectRepository
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepo: Repository<UsersEntity>,
  ) {}

  // save() is a "Repository" method (from Typeorm) to call insert query
  async create(user: IUser): Promise<UsersEntity> {
    const newUser = this.userRepo.create(user);
    return await this.userRepo.save(newUser);
  }

  // find() is a "Repository" method to call select query
  // ? throw exception if not found ?
  // unuse
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.userRepo.find();
  }

  async getByName(nameToFind: string): Promise<UsersEntity> {
    return await this.userRepo.findOneBy({
      name: nameToFind,
    });
  }

  // unuse
  async getByEmail(emailToFind: string): Promise<UsersEntity> {
    return await this.userRepo.findOneBy({
      email: emailToFind,
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

  // async updateToken(id: number, access_token: string): Promise<UsersEntity> {
  //   const user = await this.getById(id);
  //   user.accessToken = access_token;
  //   await this.userRepo.save(user);
  //   return await this.getById(id);
  // }

  async deleteUser(id: number): Promise<UsersEntity> {
    const user = await this.getById(id);
    return await this.userRepo.remove(user);
  }
}
