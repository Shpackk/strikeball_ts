import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KickInfoDto } from 'src/auth/dto/kick-info.dto';
import { Requests } from 'src/db/entity/requests.entity';
import { User } from 'src/db/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {

    constructor(
        @InjectRepository(Requests)
        private reqRepository: Repository<Requests>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}
    //passed info
    viewPlayersByTeamId(teamId: number) {
        return `players in team id ${teamId}`
    }

    //passed info
    async joinTeam(teamId: number, user: User, type) {
        const newRequest = new Requests()
        newRequest.requestType = type
        newRequest.userEmail = user.email
        newRequest.userName = user.name
        newRequest.teamId = teamId
        newRequest.user = user
        await this.reqRepository.save(newRequest)
    }

    //passed info
    leaveTeam(teamId: number) {
        return `you want to leave team ${teamId}`
    }

    kickPlayer(teamId: number, kickInfo: KickInfoDto) {
        return `kick player ${kickInfo.userId} from team ${teamId} because ${kickInfo.description}`
    }

}
