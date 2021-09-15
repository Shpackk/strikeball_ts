import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { User } from 'src/db/entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { RegUserDto } from './dto/register-user.dto';
import { Roles } from 'src/db/entity/roles.entity';
import { JwtService } from '@nestjs/jwt';
import { Banlist } from 'src/db/entity/banlist.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Roles)
        private rolesRepository: Repository<Roles>,
        @InjectRepository(Banlist)
        private banRepository: Repository<Banlist>,
        private jwtService: JwtService
    ) { }
    //users registration
    async register(user: RegUserDto ) {
        try {
            user.password = await bcrypt.hash(user.password, 10)
            const dbRole = await this.rolesRepository.findOne({
                where: {
                    name: user.role
                }
            })
            await this.usersRepository.save({
                name: user.name,
                email: user.email,
                password: user.password,
                role: dbRole
            })
            return {messsage: 'You can login now!'} 
        } catch (error) {
            console.log(error)
        }
    }

    //users login
    async login(user: LoginUserDto) {
        try {
            const userFromDb = await this.usersRepository.findOne({
                where: {
                    email: user.email
                },
                relations:['role']
            })
            if (!userFromDb) return { message: "not found" }
            
            const isBanned = await this.banRepository.findOne({
                where: {
                    user: userFromDb
                }
            })
            if (isBanned) return { message: "You are banned from service" }
            
            const compare = await bcrypt.compare(user.password, userFromDb.password)
            if (!compare) {
                return {message: "wrong password"}
            }
            const token = this.jwtService.sign({
                id: userFromDb.id,
                name: userFromDb.name,
                email: userFromDb.email,
                roleId: userFromDb.role.id
            })
            return {
                id: userFromDb.id,
                name: userFromDb.name,
                roleId: userFromDb.role.id,
                token
            }
        } catch (error) {
            console.log(error)
        }
    }
}
