import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { TeamController } from './team/team.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [],
  controllers: [AppController, AuthController, TeamController, UserController],
  providers: [AppService],
})
export class AppModule {}
