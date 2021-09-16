import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/db/entity/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class userQueries{
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) { }


    async createUser(email,name,password, role) {
        try {
            await this.userRepo.save({
                email,
                name,
                password,
                role,
            })
        } catch (error) {
            console.log(error)
        }
    }

    async findOne(email) {
        try {
            return await this.userRepo.findOne({
                where: {
                    email
                },
                relations:['role']
            })
        } catch (error) {
            console.log(error)
        }
    }

    async findOneById(id) {
        try {
            return await this.userRepo.findOne({
                where: {
                    id
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    async findProfileInfo(id) {
        try {
            return await this.userRepo.findOne({
                where: {
                    id
                },
                select: ['id', 'email', 'picture', 'name'],
                relations:['role','team']
            })
        } catch (error) {
            console.log(error)
        }
    }

    async playersByTeam(teamId) {
        try {
            return await this.userRepo.find({
                where: {
                    team: teamId
                },
                select:['id','name','email']
            }) 
        } catch (error) {
            console.log(error)
        }
    }

    async saveUser(user) {
        try {
            await this.userRepo.save(user)
        } catch (error) {
            console.log(error)
        }
    }

}