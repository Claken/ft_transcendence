/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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

  // unuse
  async getByLogin(loginToFind: string): Promise<UsersEntity> {
    return await this.userRepo.findOneBy({
      login: loginToFind,
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

  async updateUser(id: number, user: IUser): Promise<UpdateResult> {
    return await this.userRepo.update(id, user);
  }

    async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepo.delete(id);
  }
}
