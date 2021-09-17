import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { Banlist } from 'src/db/entity/banlist.entity';
import { requestsQueries } from 'src/repositoriers/requests-table';
import { teamQueries } from 'src/repositoriers/team-table';
import { userQueries } from 'src/repositoriers/user-table';
import { Repository } from 'typeorm';
import { hash } from 'src/services/passwordHash'


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Banlist)
        private banRepository: Repository<Banlist>,
        private jwtService: JwtService,
        private userQuery: userQueries,
        private requestQuery: requestsQueries,
        private teamQuery: teamQueries
    ) { }

    async extractRequests(user) {
        try {
            const request = await this.requestQuery.findMyRequests(user)
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
            const dbUser = await this.userQuery.findOne(email)
            if (!dbUser) {
                return {message:'not found'}
            }
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
            const user = await this.userQuery.findOneById(userInfo.id)
            user.password = hashedPassword
            this.userQuery.saveUser(user)
            return {message: 'Password changed'}
        } catch (error) {
            console.log(error)
        }
    }


    async updateInfo(userInfo, file, user) {
        try {
            const userDb = await this.userQuery.findOneById(user.id)
            userDb.picture = file ? file.path : null
            userDb.email = userInfo.email ? userInfo.email : userDb.email
            userDb.name = userInfo.name ? userInfo.name : userDb.name
            if (userInfo.newPass && (userInfo.newPass == userInfo.confirmPass)) {
                userDb.password = hash(userInfo.confirmPass)
            }
            await this.userQuery.saveUser(userDb)
        } catch (error) {
            console.log(error)
        }
    }

    async profile(user) {
        try {
            return await this.userQuery.findProfileInfo(user.id)
        } catch (error) {
            console.log(error)
        }
    }

    async deleteReq(requestId, user) {
        try {
            const request = await this.requestQuery.findOne(requestId,user)
            if (request) {
                this.requestQuery.delete(request)
                return {message: `request id:${requestId} deleted`}
            }
            return {message: "Something went wrong"}
        } catch (error) {
            console.log(error)            
        }
    }

    async findById(userId: number) {
        try {
            return await this.userQuery.findOneById(userId)
        } catch (error) {
            console.log(error)
        }
    }

    async banUser(userId, banInfo) {
        banInfo.type = banInfo.type.toLowerCase()
        try {
            const user = await this.userQuery.findOneById(userId)
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

    async requests() {
        try {
            return await this.requestQuery.findAllRequests()
        } catch (error) {
            console.log(error)
        }
    }

    async populateReq(isApproved, id) {
        try {
            const request = await this.requestQuery.reqAndUser(id)
            if (!request) return { message: "not found" }
            if (request.requestType == 'register' && isApproved) {
                await this.userQuery.createUser(request.userEmail,request.userName,request.userPass,2, null)
            } else if (isApproved) {
                await this.checkInAnotherTeam(request.user.id, request.teamId)
                await this.changeTeamStatus(request.user.id, request.teamId, request.requestType)
            }
            await this.requestQuery.delete(request)
        } catch (error) {
            console.log(error)
        }
    }
    async changeTeamStatus(userId, teamId, requestType) {
        try {
            if (requestType == 'join') {
                const user = await this.userQuery.findOneById(userId)
                user.team = teamId
                await this.userQuery.saveUser(user)
                return await this.addToTeam(userId, teamId)
            } else {
                await this.teamQuery.deleteFromTeam(userId, teamId)
                return await this.userQuery.clearTeamRelation(userId)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async checkInAnotherTeam(userId, teamId) {
        const teamToCheck = teamId == 1 ? 2 : 1
        try {
            const isInTeam = await this.teamQuery.checkInTeam(teamToCheck, userId)
            if (isInTeam) {
                await this.teamQuery.deleteFromTeam(userId, teamToCheck)
                return await this.userQuery.clearTeamRelation(userId)
            }
            return
        } catch (error) {
            console.log(error)
        }
    }

    async addToTeam(userId, teamId) {
        try {
            const teamDb = await this.teamQuery.findOne(teamId)
            if (teamDb.players != null) {
                const allPlayers = teamDb.players.split(',').map(Number).filter(i => {
                    if (i === 0) {
                        return false
                    }
                    return true
                })
                if (allPlayers.includes(userId)) {
                    return "player is already in this team"
                } else {
                    allPlayers.push(userId)
                    teamDb.players = allPlayers.toString()
                    this.teamQuery.updatePlayers(teamId,allPlayers.toString())
                    return `Player ${userId} joined team ${teamId}`
                }
            } else {
                this.teamQuery.updatePlayers(teamId,userId)
                return `Player ${userId} joined team ${teamId}`
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getOneManager(userId) {
        try {
            const manager = await this.userQuery.findOneById(userId)
            if (manager.role.id != 2) {
                return {message: 'This user is not a manager'}
            }
            delete manager.password
            return manager
        } catch (error) {
            console.log(error)
        }
    }

    async findAll(teamId) {
        try {
            return await this.userQuery.findAll(teamId)
        } catch (error) {
            console.log(error)
        }
    }

    async allManagers() {
        try {
            const managers = await this.userQuery.findManagers()
            return managers.filter(manager => {
                return delete manager.password 
            })
        } catch (error) {
            console.log(error)
        }
    }
}
