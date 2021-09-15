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
        try {
            const found = await this.reqRepository.findOne({
                where: {
                    user: user
                }
            })
            if (found)
                return {message: "You already applied"}

            await this.reqRepository.save({
                requestType : type,
                userEmail: user.email,
                userName:user.name,
                teamId: teamId,
                user: user
            })
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
            
            await this.reqRepository.save({
                requestType: type,
                userEmail: user.email,
                userName: user.name,
                teamId: teamId,
                user: user,
            })
            return {message: "Sucessfully applied"}
        } catch (error) {
            console.log(error)
        }
    }

    kickPlayer(teamId: number, kickInfo: KickInfoDto) {
        return `kick player ${kickInfo.userId} from team ${teamId} because ${kickInfo.description}`
    }

}
