import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entity/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }

    extractRequests() {
        return "your requests"
    }

    forgotPassRequest() {
        return "forgot pass page"
    }

    resetPassword(token : string) {
        return "reset password page " + token
    }

    updateInfo() {
        return "update info page"
    }

    profile() {
        return "your profile page"
    }

    deleteReq(requestId) {
        return `delete req ${requestId}`
    }

    findById(userId: number) {
        return `user id ${userId}`
    }

    banUser(userId: number) {
        return `ban user ${userId}`
    }



    findOne(id: number): Promise<User>{
        return this.usersRepository.findOne(id)
    }


}
