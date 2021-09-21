import { NestMiddleware } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { Log, LogDocument } from "src/db/mongo/log.schema";

export class MongoLoger implements NestMiddleware {
    constructor(
        @InjectModel(Log.name)
        private model: Model<LogDocument>
    ) { }
    
    async use(req: Request,res: Response, next: NextFunction): Promise<void> {
        try {
            const log = {
                user: req.user ? req.user : (req.body ? req.body.email : null),
                method: req.method,
                url: req.originalUrl,
                requestBody: JSON.stringify(req.body)
            }
            console.log(log)
            await new this.model(log).save()
            next()
        } catch (error) {
            throw error
        }
    }
}