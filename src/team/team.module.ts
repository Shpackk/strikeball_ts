import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Requests } from 'src/db/entity/requests.entity';
import { Team } from 'src/db/entity/teams.entity';
import { User } from 'src/db/entity/user.entity';
import { requestsQueries } from 'src/postgrQuery/requests-table-queries';
import { userQueries } from 'src/postgrQuery/user-table-queries';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports:[TypeOrmModule.forFeature([Requests, User,Team])],
  controllers: [TeamController],
  providers: [TeamService, JwtStrategy, userQueries,requestsQueries]
})
export class TeamModule {}
