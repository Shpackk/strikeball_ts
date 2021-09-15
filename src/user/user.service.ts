import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { Banlist } from 'src/db/entity/banlist.entity';
import { Requests } from 'src/db/entity/requests.entity';
import { User } from 'src/db/entity/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Requests)
        private reqRepository: Repository<Requests>,
        @InjectRepository(Banlist)
        private banRepository: Repository<Banlist>,
        private jwtService: JwtService
    ) { }

    async extractRequests(user) {
        try {
            const request = await this.reqRepository.findOne({
                where: {
                    user
                }
            })
            if (!request) return {message:"You have no requests"}
            
            return {
                id: request.id,
                requestType: request.requestType,
                teamId: request.teamId
            }
        } catch (error) {
            console.log(error)
        }
    }

    async forgotPassRequest(email) {
        try {
            const dbUser = await this.usersRepository.findOne({
                where: {
                    email
                }
            })
            const token = this.jwtService.sign({
                id: dbUser.id
            })
            return {restoreLink: `localhost:3000/user/reset-password/${token}`}
        } catch (error) {
            console.log(error)
        }
    }

    async resetPassword(token, body) {
        try {
            if (body.newPass != body.confirmPass) {
                return {message: "passwords dont match"}
            }
            const userInfo = this.jwtService.verify(token.accessToken)
            const hashedPassword = bcrypt.hashSync(body.newPass, 10)
            const user = await this.usersRepository.findOne({
                where: {
                    id: userInfo.id
                }
            })
            user.password = hashedPassword
            this.usersRepository.save(user)
        } catch (error) {
            console.log(error)
        }
    }

    updateInfo() {
        return "update info page"
    }

    profile() {
        return "your profile page"
    }

    async deleteReq(requestId, user) {
        try {
            const request = await this.reqRepository.findOne({
                where: {
                    id: requestId,
                    user:user
                }
            })
            if (request) {
                this.reqRepository.delete(request)
                return {message: `request id:${requestId} deleted`}
            }
            return {message: "Something went wrong"}
        } catch (error) {
            console.log(error)            
        }
    }

    findById(userId: number) {
        return `user id ${userId}`
    }

    async banUser(userId, banInfo) {
        banInfo.type = banInfo.type.toLowerCase()
        try {
            const user = await this.usersRepository.findOne({
                where: {
                    id: userId
                }
            })
            if (!user) return { message: "No such user" }
            const isBanned = await this.banRepository.findOne({
                where: {
                    user
                }
            })
            if (banInfo.type == "ban" && !isBanned) {
                await this.banRepository.save({
                    userEmail: user.email,
                    description: banInfo.description,
                    user: user
                })
                return { message: "ban sucessfull" }
            } else if (banInfo.type == 'unban' && isBanned) {
                await this.banRepository.delete(isBanned)
                return { message: "unban sucessfull" }
            } else {
                return {message: "Unknown command or user's account already have this status"}
        }
        } catch (error) {
            console.log(error)
        }
    }

    findOne(id: number): Promise<User>{
        return this.usersRepository.findOne(id)
    }

    async requests() {
        try {
            const requests = await this.reqRepository.find({
                select: ['id', 'requestType', 'userEmail', 'teamId']
            })
            return requests
        } catch (error) {
            console.log(error)
        }
    }

}
