import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/passport/jwt.strategy';
import { Banlist } from 'src/db/entity/banlist.entity';
import { Requests } from 'src/db/entity/requests.entity';
import { Roles } from 'src/db/entity/roles.entity';
import { Team } from 'src/db/entity/teams.entity';
import { User } from 'src/db/entity/user.entity';
import { requestsQueries } from 'src/repositoriers/requests-table';
import { teamQueries } from 'src/repositoriers/team-table';
import { userQueries } from 'src/repositoriers/user-table';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles, Requests, Banlist, Team]),
    JwtModule.register({
      secret: 'supersecret',
      signOptions:{expiresIn: '15m'}
    })
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy,userQueries,requestsQueries,teamQueries]
})
export class UserModule {}
