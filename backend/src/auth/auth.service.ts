/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEntity } from './models/auth.entity';
import { AuthPost } from './models/auth.interface';

@Injectable()
export class AuthService {
    @InjectRepository(AuthEntity)
    constructor(private readonly authPostRepo: Repository<AuthEntity>)
    {}

    // convert createPost return of type Promise into Obsevable
    createPost(authPost: AuthPost): Promise<AuthPost & AuthEntity> {
        return this.authPostRepo.save(authPost);
    }
}
