import { MiddlewareConsumer, Module, NestModule, Req, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/passport/jwtauth/jwt.strategy';
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
import { requireAdmin } from 'src/middleware/requireAdmin';
import { restrictUser } from 'src/middleware/restrictUser';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles, Requests, Banlist, Team]),
    JwtModule.register({
      secret: 'supersecret',
      signOptions:{expiresIn: '15m'}
    }),
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, userQueries,requestsQueries,teamQueries]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(requireAdmin)
      .exclude(
        {path:'/user/requests', method:RequestMethod.GET},
        {path:'/user/profile', method:RequestMethod.GET}
      )
      .forRoutes(
        { path: '/manager/:id', method: RequestMethod.GET },
        { path: '/user/:id/ban', method: RequestMethod.POST },
        { path: '/managers', method: RequestMethod.GET }
    )
      .apply(restrictUser)
      .exclude(
        { path: '/user/requests', method: RequestMethod.GET },
        {path:'/user/profile', method:RequestMethod.GET}
      )
      .forRoutes(
          {path: '/requests/:id', method: RequestMethod.PATCH},
          {path: '/user/:id', method: RequestMethod.GET},
          {path: '/requests', method: RequestMethod.GET},
      )
  }
}
