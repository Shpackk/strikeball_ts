import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { User } from 'src/db/entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { RegUserDto } from './dto/register-user.dto';
import { Roles } from 'src/db/entity/roles.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Roles)
        private rolesRepository: Repository<Roles>
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
                role: dbRole.id, 
            })
            //to find relation with some table use this
            // const userRole = await this.usersRepository.findOne({
            //     where: {
            //         name: user.name
            //     },
            //     relations:['role']
            // })
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
                }
            })
            const compare = await bcrypt.compare(user.password, userFromDb.password)
            return compare ? userFromDb : { message: 'Wrong Password' }
        } catch (error) {
            console.log(error)
        }
    }
}
