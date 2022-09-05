/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { AuthEntity } from './models/auth.entity';
import { AuthPost } from './models/auth.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthEntity)
        private readonly authPostRepo: Repository<AuthEntity>
    ) {}

    /**
     * @param authPost 
     * @returns 
     * convert createUser() return of type "Promise<>" into "Observable<>"
     * from() is specified due to "Observable<>""
     * save() is a "Repository" method to call insert query
     */
    createUser(authPost: AuthPost): Observable<AuthPost> {
        return from(this.authPostRepo.save(authPost));
    }

    // find() is a "Repository" method to call select query
    findAllUsers(): Observable<AuthPost[]> {
        return from(this.authPostRepo.find());
    }
}
