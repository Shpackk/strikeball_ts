import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/passport/jwtauth/jwt.strategy';
import { Requests } from 'src/db/entity/requests.entity';
import { Team } from 'src/db/entity/teams.entity';
import { User } from 'src/db/entity/user.entity';
import { requestsQueries } from 'src/repositoriers/requests-table';
import { teamQueries } from 'src/repositoriers/team-table';
import { userQueries } from 'src/repositoriers/user-table';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { requireAdmin } from 'src/middleware/requireAdmin';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Requests, User, Team]),
    MailModule
  ],
  controllers: [TeamController],
  providers: [TeamService, JwtStrategy, userQueries,requestsQueries,teamQueries]
})
export class TeamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(requireAdmin)
      .forRoutes({path: 'team/:id/kick', method:RequestMethod.DELETE})
  }
}
