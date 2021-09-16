import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "src/db/entity/teams.entity";
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
         console.log(error)
     }   
    }

    async updatePlayers(id, players) {
        try {
            await this.teamRepo.update({id},
                {
                players
            })
        } catch (error) {
            console.log(error)
        }
    }
}