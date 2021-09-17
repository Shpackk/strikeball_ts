import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/db/entity/user.entity";
import { IsNull, Not, NoVersionOrUpdateDateColumnError, Repository } from "typeorm";


@Injectable()
export class userQueries{
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) { }


    async createUser(email,name,password, role, filePath) {
        try {
            await this.userRepo.save({
                email,
                name,
                password,
                role,
                picture: filePath ? filePath : null
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
                },
                relations:['role']
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

    async clearTeamRelation(userId) {
        try {
            const userDb = await this.findOneById(userId)
            userDb.team = null
            await this.saveUser(userDb)
        } catch (error) {
            console.log(error)
        }
    }

    async findAll(teamId) {
        let lookParam = {
            where: {},
            relations:['role','team']
        }
        lookParam.where = teamId ? {team: teamId} : { id: Not(IsNull()) }
        try {
            const users = await this.userRepo.find(lookParam)
            return users.filter(user => {
                return delete user.password
            })
            //swap filter 
        } catch (error) {
            console.log(error)
        }
    }

    async findManagers() {
        try {
            return await this.userRepo.find({
                where: {
                    role: 2
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}