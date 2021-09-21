import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { JwtStrategy } from '../passport/jwtauth/jwt.strategy';
import { SocketGateWay } from 'src/services/socket.gateway';
import { GoogleStrategy } from 'src/passport/jwtauth/google.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from 'src/db/mongo/log.schema';
import { MongoLoger } from 'src/middleware/mongoLoger';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles, Banlist, Requests]),
    MongooseModule.forFeature([{name: Log.name,schema:LogSchema}]),
    JwtModule.register({
      secret: 'supersecret',
      signOptions:{expiresIn: '24h'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,GoogleStrategy,userQueries,requestsQueries, SocketGateWay]
})
export class AuthModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MongoLoger)
      .forRoutes(AuthController)
  }
}
