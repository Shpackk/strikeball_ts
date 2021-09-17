import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banlist } from 'src/db/entity/banlist.entity';
import { Requests } from 'src/db/entity/requests.entity';
import { Roles } from 'src/db/entity/roles.entity';
import { User } from 'src/db/entity/user.entity';
import { requestsQueries } from 'src/repositoriers/requests-table';
import { userQueries } from 'src/repositoriers/user-table';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../passport/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles, Banlist, Requests]),
    JwtModule.register({
      secret: 'supersecret',
      signOptions:{expiresIn: '24h'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,userQueries,requestsQueries]
})
export class AuthModule {}
