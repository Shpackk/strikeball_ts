import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KickInfoDto } from 'src/auth/dto/kick-info.dto';
import { Requests } from 'src/db/entity/requests.entity';
import { User } from 'src/db/entity/user.entity';
import { requestsQueries } from 'src/postgrQuery/requests-table-queries';
import { userQueries } from 'src/postgrQuery/user-table-queries';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {

    constructor(
        @InjectRepository(Requests)
        private reqRepository: Repository<Requests>,
        private userQuery: userQueries,
        private reqQuery: requestsQueries
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

    kickPlayer(teamId: number, kickInfo: KickInfoDto) {
        return `kick player ${kickInfo.userId} from team ${teamId} because ${kickInfo.description}`
    }

}
