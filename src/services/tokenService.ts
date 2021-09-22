import * as jwt from "jsonwebtoken"

export const signToken = payload =>{
    try {
        return jwt.sign(payload, process.env.JWT_SECRET)
    } catch (error) {
        throw error
    }
}