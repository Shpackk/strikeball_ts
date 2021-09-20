import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async forgotPassRequest(email) {
        try {
            const dbUser = await this.userQuery.findOne(email)
            if (!dbUser) {
                throw new NotFoundException('User Not Found')
            }
            const token = this.jwtService.sign({
                id: dbUser.id
            })
            return {restoreLink: `localhost:3000/user/reset-password/${token}`}
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async resetPassword(token, body) {
        try {
            if (body.newPass != body.confirmPass) {
                return {message: "passwords dont match"}
            }
            const userInfo = this.jwtService.verify(token)
            const user = await this.userQuery.findOneById(userInfo.id)
            if(!user) throw new NotFoundException('User Not Found')
            const hashedPassword = bcrypt.hashSync(body.newPass, 10)
            user.password = hashedPassword
            this.userQuery.saveUser(user)
            return {message: 'Password changed'}
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async updateInfo(userInfo, file, user) {
        try {
            const isEmailTaken = await this.userQuery.findOne(userInfo.email)
            if(isEmailTaken) throw new ConflictException('This Email Is Taken')
            const userDb = await this.userQuery.findOneById(user.id)
            if(!userDb) throw new NotFoundException('User Not Found')
            userDb.picture = file ? file.path : null
            userDb.email = userInfo.email ? userInfo.email : userDb.email
            userDb.name = userInfo.name ? userInfo.name : userDb.name
            if (userInfo.newPass && (userInfo.newPass == userInfo.confirmPass)) {
                userDb.password = hash(userInfo.confirmPass)
            }
            await this.userQuery.saveUser(userDb)
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async profile(user) {
        try {
            return await this.userQuery.findProfileInfo(user.id)
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteReq(requestId, user) {
        try {
            const request = await this.requestQuery.findOne(requestId,user)
            if (!request) {
                throw new NotFoundException('Request Not Found')
            }
            this.requestQuery.delete(request)
            return {message: `request id:${requestId} deleted`}
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)         
        }
    }

    async findById(userId: number) {
        try {
            const user = await this.userQuery.findOneById(userId)
            if (!user) {
                throw new NotFoundException('User Not Found')
            }
            delete user.password
            return user
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)  
        }
    }

    async banUser(userId, banInfo) {
        banInfo.type = banInfo.type.toLowerCase()
        try {
            const user = await this.userQuery.findOneById(userId)
            if (!user) throw new NotFoundException('User Not Found')
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
                throw new ConflictException("Unknown command or user's account already have this status")
        }
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)  
        }
    }

    async requests() {
        try {
            return await this.requestQuery.findAllRequests()
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

    async populateReq(isApproved, id) {
        try {
            const request = await this.requestQuery.reqAndUser(id)
            if (!request) throw new NotFoundException('There Is No Such Request')
            if (request.requestType == 'register' && isApproved) {
                await this.userQuery.createUser(request.userEmail,request.userName,request.userPass,2, null)
            } else if (isApproved) {
                await this.checkInAnotherTeam(request.user.id, request.teamId)
                await this.changeTeamStatus(request.user.id, request.teamId, request.requestType)
            }
            await this.requestQuery.delete(request)
            return {message: `Request ${id} is ${isApproved}`}
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }
    async changeTeamStatus(userId, teamId, requestType) {
        try {
            if (requestType == 'join') {
                const user = await this.userQuery.findOneById(userId)
                if(!user) throw new NotFoundException('User Not Found')
                user.team = teamId
                await this.userQuery.saveUser(user)
                return await this.addToTeam(userId, teamId)
            } else {
                await this.teamQuery.deleteFromTeam(userId, teamId)
                return await this.userQuery.clearTeamRelation(userId)
            }
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
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
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

    async addToTeam(userId, teamId) {
        try {
            const teamDb = await this.teamQuery.findOne(teamId)
            if(!teamDb) throw new NotFoundException('There Is No Such Team')
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
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

    async getOneManager(userId) {
        try {
            const manager = await this.userQuery.findOneById(userId)
            if (manager.role.id != 2) {
                throw new ConflictException('User Is Not A Manager')
            }
            delete manager.password
            return manager
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

    async findAll(teamId) {
        try {
            const team = await this.userQuery.findAll(teamId)
            if (!team) {
                throw new NotFoundException('Team Not Found')
            }
            return team
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

    async allManagers() {
        try {
            const managers = await this.userQuery.findManagers()
            return managers.filter(manager => {
                return delete manager.password 
            })
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }
}
