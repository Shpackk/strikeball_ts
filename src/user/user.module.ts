import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Banlist } from 'src/db/entity/banlist.entity';
import { Requests } from 'src/db/entity/requests.entity';
import { Roles } from 'src/db/entity/roles.entity';
import { User } from 'src/db/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles, Requests, Banlist]),
    JwtModule.register({
      secret: 'supersecret',
      signOptions:{expiresIn: '15m'}
    })
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})
export class UserModule {}
