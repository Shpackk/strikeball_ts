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
import { SocketGateWay } from 'src/services/socket.gateway';
import { MongoLoger } from 'src/middleware/mongoLoger';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from 'src/db/mongo/log.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Requests, User, Team]),
    MongooseModule.forFeature([{name: Log.name,schema:LogSchema}]),
    MailModule
  ],
  controllers: [TeamController],
  providers: [TeamService, JwtStrategy, userQueries,requestsQueries,teamQueries,SocketGateWay]
})
export class TeamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(requireAdmin)
      .forRoutes({ path: 'team/:id/kick', method: RequestMethod.DELETE })
      .apply(MongoLoger)
      .forRoutes(TeamController)
  }
}
