/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UsersEntity } from './models/users.entity';
import { IUser } from './models/users.interface';

@Injectable()
export class UsersService {
  // We inject the UsersRepository(Entity) into the UsersService using the @InjectRepository
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepo: Repository<UsersEntity>,
  ) {}

  // save() is a "Repository" method (from Typeorm) to call insert query
  create(userDetails: IUser): Promise<IUser> {
    const newUser = this.userRepo.create(userDetails);
    return this.userRepo.save(newUser);
  }

  // find() is a "Repository" method to call select query
  // ? throw exception if not found ?
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.userRepo.find();
  }

  async getByUsername(usernameToFind: string): Promise<UsersEntity> {
    return await this.userRepo.findOneBy({
      username: usernameToFind,
    });
  }

  async getByEmail(emailToFind: string): Promise<UsersEntity> {
    return await this.userRepo.findOneBy({
      emails: emailToFind,
    });
  }

  async getById(idToFind: number): Promise<UsersEntity> {
    return await this.userRepo.findOneBy({
      id: idToFind,
    });
  }

  async updateUser(id: number, userDetails: IUser): Promise<UpdateResult> {
    return await this.userRepo.update(id, userDetails);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepo.delete(id);
  }
}
