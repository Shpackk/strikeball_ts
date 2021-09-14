import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Requests } from 'src/db/entity/requests.entity';
import { User } from 'src/db/entity/user.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports:[TypeOrmModule.forFeature([Requests, User])],
  controllers: [TeamController],
  providers: [TeamService, JwtStrategy]
})
export class TeamModule {}
