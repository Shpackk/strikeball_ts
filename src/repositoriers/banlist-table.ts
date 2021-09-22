import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Banlist } from "../../src/db/entity/banlist.entity";
import {Repository } from "typeorm";


@Injectable()
export class banlistQueries {
    constructor(
        @InjectRepository(Banlist)
        private banlistRepo: Repository<Banlist>
    ) { }

    async isBanned(user): Promise<Banlist> {
        try {
            return await this.banlistRepo.findOne({
                where: {
                    user
                }
            })
        } catch (error) {
            throw error
        }
    }
}