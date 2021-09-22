import {
    ConflictException, ForbiddenException, HttpException, HttpStatus,
    Injectable, InternalServerErrorException, NotFoundException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { RegUserDto } from './dto/register-user.dto';
import { userQueries } from '../../src/repositoriers/user-table';
import { requestsQueries } from '../../src/repositoriers/requests-table';
import { SocketGateWay } from '../../src/services/socket.gateway';
import { rolesQueries } from '../../src/repositoriers/roles-table';
import { banlistQueries } from '../../src/repositoriers/banlist-table';
import { signToken } from '../../src/services/tokenService';
import { User } from '../../src/db/entity/user.entity';
import { GoogleUserDto } from './dto/google-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegResponseDto } from './dto/reg-response.dto';
import { reqType } from '../../src/db/entity/requests.entity';

@Injectable()
export class AuthService {
    constructor(
        private rolesQuery: rolesQueries,
        private banlistQuery: banlistQueries,
        private userQuery: userQueries,
        private reqQuery: requestsQueries,
        private socketMsg: SocketGateWay
    ) { }
    async register(user: RegUserDto, file ): Promise<RegResponseDto> {
        try {
            const filepath = file ? file.path : null
            const isRegistered = await this.userQuery.findOne(user.email)
            if(isRegistered) throw new ConflictException('This User Is Already Registered')
            user.password = await bcrypt.hash(user.password, 10)
            const dbRole = await this.rolesQuery.findRole(user.role)
            if(!dbRole) throw new ConflictException('Invalid Role')
            if (user.role == 'user') {
                await this.userQuery.createUser(user.email,user.name,user.password,dbRole, filepath)
                return { message: 'You can login now!' }
            } else {
                await this.reqQuery.createReq(null, reqType.REGISTER, user)
                this.socketMsg.notifyAdmin('Manager Reg')
                return {message : 'You applied! Wait until we approve'}
            }
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async login(user: LoginUserDto){
        try {
            const userFromDb = await this.userQuery.findOne(user.email)
            if (!userFromDb) throw new NotFoundException('User Not Found')
            const isBanned = await this.banlistQuery.isBanned(userFromDb)
            if (isBanned) throw new ForbiddenException('You Are Banned From Service')
            const compare = await bcrypt.compare(user.password, userFromDb.password)
            if (!compare) {
                throw new ConflictException('Wrong Password')
            }
            const token = this.getToken(userFromDb)
            return this.returnUser(userFromDb, token)
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async googleLogin(user: GoogleUserDto) {
        try {
            if (!user) throw new InternalServerErrorException('Google Auth Error. Try Again')
            const found = await this.userQuery.findGoogleUser(user.googleId)
            if (found) {
                const token = this.getToken(found)
                return this.returnUser(found, token)
            }
            const role = await this.rolesQuery.findRole('user')
            user.name = user.email.split('@')[0]
            const newUser = await this.userQuery.createGoogleUser(user, role)
            const token = this.getToken(newUser)
            return this.returnUser(newUser, token)
        } catch (error) {
            throw new HttpException(error, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    getToken(user: User): string {
        try {
           return signToken({
                id: user.id,
                name: user.name,
                email: user.email,
                roleId: user.role.id
           })
        } catch (error) {
            throw error
        }
    }

    returnUser(user: User,token: string): LoginResponseDto {
        try {
            return {
                id: user.id,
                name: user.name,
                roleId: user.role.id,
                token
            }
        } catch (error) {
            throw error
        }
    }
}
