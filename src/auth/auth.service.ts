import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService{
    async register(user: CreateUserDto) {
        user.password = await bcrypt.hash(user.password, 10)
        return 'cool'
    }

    async login(user: LoginUserDto) {
        console.log(user)
        return 'logged in'
    }
}