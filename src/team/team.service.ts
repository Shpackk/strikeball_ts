import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KickInfoDto } from 'src/auth/dto/kick-info.dto';
import { Requests } from 'src/db/entity/requests.entity';
import { User } from 'src/db/entity/user.entity';
import { requestsQueries } from 'src/repositoriers/requests-table';
import { teamQueries } from 'src/repositoriers/team-table';
import { userQueries } from 'src/repositoriers/user-table';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {

    constructor(
        @InjectRepository(Requests)
        private reqRepository: Repository<Requests>,
        private userQuery: userQueries,
        private reqQuery: requestsQueries,
        private teamQuery: teamQueries
    ){}
    //passed info
    async viewPlayersByTeamId(teamId: number) {
        try {
            return await this.userQuery.playersByTeam(teamId)
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

    //passed info
    async joinTeam(teamId: number, user: User, type) {
        try {
            const found = await this.reqRepository.findOne({
                where: {
                    user: user
                }
            })
            if (found) {
                throw new ConflictException('You Already Applied. Wait Until We Approve')
            }
            const teamExist = await this.teamQuery.findOne(teamId)
            if(!teamExist) throw new NotFoundException('This Team Does Not Exist')
            await this.reqQuery.createReq(teamId, type, user)
            return {message: "Sucessfully applied"}
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

    async leaveTeam(teamId: number, user: User, type) {
        try {
            const found = await this.reqRepository.findOne({
                where: {
                    user: user
                }
            })
            if (found) {
                throw new ConflictException('You Already Applied. Wait Until We Approve')
            }
            const teamExist = await this.teamQuery.findOne(teamId)
            if(!teamExist) throw new NotFoundException('This Team Does Not Exist')
            await this.reqQuery.createReq(teamId, type, user)
            return {message: "Sucessfully applied"}
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

    async kickPlayer(teamId: number, kickInfo: KickInfoDto) {
        try {
            const teamExist = await this.teamQuery.findOne(teamId)
            if (!teamExist) throw new NotFoundException('This Team Does Not Exist')
            await this.userQuery.clearTeamRelation(kickInfo.userId)
            await this.teamQuery.deleteFromTeam(kickInfo.userId, teamId)
            return {message: `User ${kickInfo.userId} kicked from team id:${teamId}`}
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

}
