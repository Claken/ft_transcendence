/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UsersEntity } from './models/users.entity';
import { UsersPost } from './models/users.interface';

@Injectable()
export class UsersService {
  // We inject the UsersRepository(Entity) into the UsersService using the @InjectRepository
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersPostRepo: Repository<UsersEntity>,
  ) {}

  /**
   * @param usersPost
   * @returns
   * save() is a "Repository" method (from Typeorm) to call insert query
   */
  async create(usersPost: UsersPost): Promise<UsersPost> {
    return await this.usersPostRepo.save(usersPost);
  }

  // find() is a "Repository" method to call select query
  // ? throw exception if not found ?
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.usersPostRepo.find();
  }

  async findOneBy(usernameToFind: string): Promise<UsersEntity> {
    return await this.usersPostRepo.findOneBy({
      username: usernameToFind,
    });
  }

  async getByEmail(emailToFind: string): Promise<UsersEntity> {
    return await this.usersPostRepo.findOneBy({
      email: emailToFind,
    });
  }
  
  async getById(idToFind: number): Promise<UsersEntity> {
    return await this.usersPostRepo.findOneBy({
      id: idToFind,
    });
  }

  async updateUser(id: number, usersPost: UsersPost): Promise<UpdateResult> {
    return await this.usersPostRepo.update(id, usersPost);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.usersPostRepo.delete(id);
  }
}
