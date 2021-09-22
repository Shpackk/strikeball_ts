import { NestMiddleware } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import * as jwt from "jsonwebtoken"
import { Log, LogDocument } from "../../src/db/mongo/log.schema";

export class MongoLoger implements NestMiddleware {
    constructor(
        @InjectModel(Log.name)
        private model: Model<LogDocument>
    ) { }
    
    async use(req: Request,res: Response, next: NextFunction): Promise<void> {
        try {
            let user;
            const token = req.header('authorization') ? req.header('authorization').split(' ')[1] : null
            user = token ? jwt.decode(token) : null
            const log = {
                user: user ? user.email : 'Unathorized',
                method: req.method,
                url: req.originalUrl,
                requestBody: JSON.stringify(req.body)
            }
            await new this.model(log).save()
            next()
        } catch (error) {
            throw error
        }
    }
}