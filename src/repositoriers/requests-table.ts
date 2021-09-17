import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Requests } from "src/db/entity/requests.entity";


@Injectable()
export class requestsQueries{

    constructor(
        @InjectRepository(Requests)
        private requestRepo: Repository<Requests>
    ){}

    async findOne(id, user) {
        try {
            return await this.requestRepo.findOne({
                where: {
                    id,
                    user
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    async delete(request) {
        try {
            await this.requestRepo.delete(request)
            return
        } catch (error) {
            console.log(error)
        }
    }

    async findAllRequests() {
        try {
            return await this.requestRepo.find({
                select:['id','requestType','userEmail','teamId']
            })
        } catch (error) {
            console.log(error)
        }
    }

    async findMyRequests(user) {
        try {
            return await this.requestRepo.findOne({
                where: {
                    user
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    async reqAndUser(id) {
        try {
            return await this.requestRepo.findOne({
                where: {
                    id
                },
                relations:['user']
            })
        } catch (error) {
            console.log(error)
        }
    }

    async createReq(teamId, type, user) {
        let reqObject = {
            requestType : type,
            userEmail: user.email,
            userName: user.name,
            userPass: user.password,
            teamId: teamId,
            user: user
        }
        reqObject.userPass = type == "register" ? user.password : null
        reqObject.user = type == "register" ? null : user
        try {
            await this.requestRepo.save(reqObject)
        } catch (error) {
            console.log(error)
        }
    }

}