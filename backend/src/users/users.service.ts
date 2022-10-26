import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { Repository } from 'typeorm';
import { UsersEntity } from '../TypeOrm/Entities/users.entity';

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

  async getLatestUser(): Promise<UsersEntity> {
    return await this.userRepo.findOne({
      where: {},
      order: { id: 'DESC' },
      });
  }

  async updateStatusUser(id: number, status: string): Promise<UsersEntity> {
    const user = await this.getById(id);
    user.status = status;
    return await this.userRepo.save(user);
  }

  async updateUser(id: number): Promise<UsersEntity> {
    const user = await this.getById(id);
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
