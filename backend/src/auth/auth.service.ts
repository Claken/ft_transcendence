/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { AuthEntity } from './models/auth.entity';
import { AuthPost } from './models/auth.interface';

@Injectable()
export class AuthService {
    // We inject the UsersRepository(Entity) into the UsersService using the @InjectRepository
    constructor(
        @InjectRepository(AuthEntity)
        private readonly authPostRepo: Repository<AuthEntity>
    ) {}

    /**
     * @param authPost 
     * @returns 
     * save() is a "Repository" method (from Typeorm) to call insert query
     */
    async createUser(authPost: AuthPost): Promise<AuthPost> {
        return await this.authPostRepo.save(authPost);
    }

    // find() is a "Repository" method to call select query
    async findAllUsers(): Promise<AuthEntity[]> {
        return await this.authPostRepo.find();
    }

    async updateUser(id: number, authPost: AuthPost): Promise<UpdateResult> {
        return await this.authPostRepo.update(id, authPost);
    }

    async deleteUser(id: number): Promise<DeleteResult> {
        return await this.authPostRepo.delete(id);
    }
}
