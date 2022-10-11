/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IUser, Users } from '../TypeOrm/Entities/users.entity';

@Injectable()
export class UsersService {
  // We inject the UsersRepository(Entity) into the UsersService using the @InjectRepository
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}

  // save() is a "Repository" method (from Typeorm) to call insert query
  async create(user: IUser): Promise<Users> {
    const newUser = this.userRepo.create(user);
    return await this.userRepo.save(newUser);
  }

  // find() is a "Repository" method to call select query
  // ? throw exception if not found ?
  // unuse
  async findAllUsers(): Promise<Users[]> {
    return await this.userRepo.find();
  }

  // unuse
  async getByLogin(loginToFind: string): Promise<Users> {
    return await this.userRepo.findOneBy({
      login: loginToFind,
    });
  }

  // unuse
  async getByEmail(emailToFind: string): Promise<Users> {
    return await this.userRepo.findOneBy({
      email: emailToFind,
    });
  }

  async getById(idToFind: number): Promise<Users> {
    return await this.userRepo.findOneBy({
      id: idToFind,
    });
  }

  // unuse
  async updateUser(id: number, user: IUser): Promise<UpdateResult> {
    return await this.userRepo.update(id, user);
  }

  // async updateToken(id: number, access_token: string): Promise<Users> {
  //   const user = await this.getById(id);
  //   user.accessToken = access_token;
  //   await this.userRepo.save(user);
  //   return await this.getById(id);
  // }

  // unuse
  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepo.delete(id);
  }
}
