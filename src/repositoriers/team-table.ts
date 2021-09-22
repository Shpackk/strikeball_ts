import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "../../src/db/entity/teams.entity";
import { Repository } from "typeorm";


@Injectable()
export class teamQueries {
    constructor(
        @InjectRepository(Team)
        private teamRepo: Repository<Team>
    ) { }
    
    async findOne(id) {
     try {
         return await this.teamRepo.findOne({
             where: {
                 id
             },
             select:['players']
         })
     } catch (error) {
         throw error
     }   
    }

    async updatePlayers(id, players) {
        try {
            await this.teamRepo.update({id},
                {
                players
            })
        } catch (error) {
            throw error
        }
    }

    async checkInTeam(teamId, userId) {
        try {
            const teamDb = await this.teamRepo.findOne(teamId)
            if (!teamDb) return { message: "no such team" }
            if (teamDb.players == null) return false
            const allPlayers = teamDb.players.split(',').map(Number)
            if (allPlayers.includes(userId)) {
                return "player is already in this team"
            }
            return false
        } catch (error) {
             throw error
        }
    }

    async deleteFromTeam(userId, teamId) {
        try {
            const teamDb = await this.findOne(teamId)
            const allPlayers = teamDb.players.split(',').map(Number).filter(i => {
                if (i == userId) {
                    return false
                }
                return true
            }).toString()
            this.updatePlayers(teamId, allPlayers)
        } catch (error) {
            throw error
        }
    }

    
}