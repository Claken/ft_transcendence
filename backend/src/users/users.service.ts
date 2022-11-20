import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { DataSource, Repository } from 'typeorm';
import { UsersEntity } from '../TypeOrm/Entities/users.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AvatarService } from 'src/avatar/avatar.service';
import { Avatar } from 'src/TypeOrm';

@Injectable()
export class UsersService {
  // userRepo reflects the UsersEntity in database
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepo: Repository<UsersEntity>,
    private readonly avatarService: AvatarService,
    private datasource: DataSource
  ) {}

  // save() is a Repository Typeorm method to call INSERT query
  // TODO: handle users already exist
  async create(user: UserDTO, buffer: Buffer) {
    const newUser = this.userRepo.create(user);
    if (newUser.login) {
      const filename = 'avatarApi42.jpg';
      const avatar = await this.avatarService.uploadAvatar(buffer, filename);
      newUser.avatarId = avatar.id;
    }
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

  @Cron(CronExpression.EVERY_30_MINUTES)
  async removeGuestUsers(): Promise<UsersEntity[]> {
    const guestUsers = await this.userRepo.findBy({
      login: '',
    });
    if (!guestUsers) return [];
    return await this.userRepo.remove(guestUsers);
  }

  /* ********************************************************* */
  /*                          TwoFA                            */
  /* ********************************************************* */

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

  /* ********************************************************* */
  /*                          Avatar                           */
  /* ********************************************************* */

  async updateAvatarId(id: number, avatarId: number): Promise<UsersEntity> {
    const user = await this.getById(id);
    user.avatarId = avatarId;
    return await this.userRepo.save(user);
  }

  async addAvatar(
    userId: number,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<Avatar> {

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepo.findOneBy({
        id: userId,
      });
      const currentAvatarId = user.avatarId;
      const avatar = await this.avatarService.uploadAvatarWithQueryRunner(imageBuffer, filename, queryRunner);
 
      await queryRunner.manager.update(UsersEntity, userId, {
        avatarId: avatar.id
      });
 
      if (currentAvatarId) {
        await this.avatarService.deleteAvatarWithQueryRunner(currentAvatarId, queryRunner);
      }
      await queryRunner.commitTransaction();
 
      return avatar;
    } catch {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
