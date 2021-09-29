import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../src/db/entity/user.entity";
import { IsNull, Not, Repository } from "typeorm";


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
            throw error
        }
    }

    async createGoogleUser(user,role) {
        try {
            return await this.userRepo.save({
                email: user.email,
                name: user.name,
                picture: user.picture,
                googleId: user.googleId,
                role: role
            })
        } catch (error) {
            throw error
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
            throw error
        }
    }

    async findGoogleUser(googleId) {
        try {
            return await this.userRepo.findOne({
                where: {
                    googleId
                },
                relations:['role']
            })
        } catch (error) {
            throw error
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
           throw error
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
            throw error
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
            throw error
        }
    }

    async saveUser(user) {
        try {
            await this.userRepo.save(user)
        } catch (error) {
           throw error
        }
    }

    async clearTeamRelation(userId) {
        try {
            const userDb = await this.findOneById(userId)
            userDb.team = null
            await this.saveUser(userDb)
        } catch (error) {
            throw error
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
        } catch (error) {
            throw error
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
           throw error
        }
    }

    async findAdmin() {
        try {
            return await this.userRepo.findOne({
                where: {
                    role:3
                }
            })
        } catch (error) {
            throw error
        }
    }

}