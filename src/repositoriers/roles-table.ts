import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "../../src/db/entity/roles.entity";
import {Repository } from "typeorm";


@Injectable()
export class rolesQueries {
    constructor(
        @InjectRepository(Roles)
        private rolesRepo: Repository<Roles>
    ) { }

    async findRole(name): Promise<Roles> {
        try {
            return await this.rolesRepo.findOne({
                where: {
                    name
                }
            })
        } catch (error) {
            throw error
        }
    }
}