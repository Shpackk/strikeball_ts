import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entity/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ){}

    findAll(): string{
        // return this.usersRepository.find()
        return "hello user"
    }
    findOne(id: number): Promise<User>{
        return this.usersRepository.findOne(id)
    }

}
