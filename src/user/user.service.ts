import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { Banlist } from 'src/db/entity/banlist.entity';
import { requestsQueries } from 'src/postgrQuery/requests-table-queries';
import { teamQueries } from 'src/postgrQuery/team-table-queries';
import { userQueries } from 'src/postgrQuery/user-table-queries';
import { Repository } from 'typeorm';


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
        } catch (error) {
            console.log(error)
        }
    }

    updateInfo() {
        return "update info page"
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
                await this.userQuery.createUser(request.userEmail,request.userName,request.userPass,2)
                
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
                await this.deleteFromTeam(userId, teamId)
            }
        } catch (error) {
            console.log(error)
        }
    }
    /////// for populate request
    async checkInAnotherTeam(userId, teamId) {
        const teamToCheck = teamId == 1 ? 2 : 1
        try {
            const isInTeam = await this.checkInTeam(teamToCheck, userId)
            if (isInTeam) {
                return await this.deleteFromTeam(userId, teamToCheck)
            }
            return
        } catch (error) {
            console.log(error)
        }
    }
    /// for check in Team
    async checkInTeam(teamId, userId) {
        try {
            const teamDb = await this.teamQuery.findOne(teamId)
            if (!teamDb) return { message: "no such team" }
            if (teamDb.players == null) return false
            const allPlayers = teamDb.players.split(',').map(Number)
            if (allPlayers.includes(userId)) {
                return "player is already in this team"
            }
            return false
        } catch (error) {
             console.log(error)
        }
    }

    //delete from team 
    async deleteFromTeam(userId, teamId) {
        try {
            const teamDb = await this.teamQuery.findOne(teamId)
            const allPlayers = teamDb.players.split(',').map(Number).filter(i => {
                if (i == userId) {
                    return false
                }
                return true
            }).toString()
            this.teamQuery.updatePlayers(teamId, allPlayers)
            const userDb = await this.userQuery.findOneById(userId)
            userDb.team = null
            await this.userQuery.saveUser(userDb)
        } catch (error) {
            throw error
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
            //split 
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
        throw error
    }
    }
}
