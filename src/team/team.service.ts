import { Injectable } from '@nestjs/common';
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
            console.log(error)
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
                return { message: "You already applied" }
            }
            await this.reqQuery.createReq(teamId, type, user)
            return {message: "Sucessfully applied"}
        } catch (error) {
            console.log(error)
        }
    }

    //passed info
    async leaveTeam(teamId: number, user: User, type) {
        try {
            const found = await this.reqRepository.findOne({
                where: {
                    user: user
                }
            })
            if (found)
                return { message: "You already applied" }
            
            await this.reqQuery.createReq(teamId, type, user)
            return {message: "Sucessfully applied"}
        } catch (error) {
            console.log(error)
        }
    }

    async kickPlayer(teamId: number, kickInfo: KickInfoDto) {
        try {
            await this.userQuery.clearTeamRelation(kickInfo.userId)
            await this.teamQuery.deleteFromTeam(kickInfo.userId, teamId)
            return {message: `User ${kickInfo.userId} kicked from team id:${teamId}`}
        } catch (error) {
            console.log(error)
        }
    }

}
