import * as data from "../test/testUsersData"
import { hash } from "../src/services/passwordHash";
import { User } from "../src/db/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class HelpService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }
    // private usersRepository: User
    // constructor(
    //     private readonly connection: Connection
    // ) {
    //     this.usersRepository = this.connection.getCustomRepository(User)
    // }

    async createTestUsers() {
        const newManager = { ...data.testManager, password: hash(data.testManager.password) }
        const newUserr = { ...data.testUserTwo, password: hash(data.testUserTwo.password) }
        const newUser = { ...data.testUser, password: hash(data.testUser.password) }
        console.log(this.usersRepository)
        await this.usersRepository.save(newManager)
        await this.usersRepository.save(newUserr)
        await this.usersRepository.save(newUser)
    }

    async deleteTestUsers() {
        await this.usersRepository.delete({name: data.testManager.name})
        await this.usersRepository.delete({name: data.testUserTwo.name})
        await this.usersRepository.delete({name: data.testUser.name})
    }

}