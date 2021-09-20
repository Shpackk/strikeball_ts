import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'

export function restrictUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.header('authorization')) {
            return res.json({message:'Authorize first'})
        }
        let decodedToken;
        const token = req.header('authorization').split(' ')[1]
        decodedToken = jwt.decode(token)
        if (decodedToken.roleId == 1) {
           return res.status(401).json({message: 'No permission'})
        }   
        next()
    } catch (error) {
        console.log(error)
    }
}