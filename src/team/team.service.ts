import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamService {
    
    async join(teamId: number) {
         return teamId
    }
    async leave(teamId: number) {
        return 'you leaved team ' + teamId
    }

    async getPlayers(teamId: number) {
        return 'players from team' + teamId
    }

    async kickPlayer(teamId: number, playerId: object) {
        return `kick player ${playerId} from team ${teamId}`
    }
}
