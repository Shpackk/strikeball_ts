import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/passport/jwt.strategy';
import { Requests } from 'src/db/entity/requests.entity';
import { Team } from 'src/db/entity/teams.entity';
import { User } from 'src/db/entity/user.entity';
import { requestsQueries } from 'src/repositoriers/requests-table';
import { teamQueries } from 'src/repositoriers/team-table';
import { userQueries } from 'src/repositoriers/user-table';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { AdminStrategy } from 'src/passport/jwt.admin.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([Requests, User,Team])],
  controllers: [TeamController],
  providers: [TeamService, JwtStrategy,AdminStrategy, userQueries,requestsQueries,teamQueries]
})
export class TeamModule {}
