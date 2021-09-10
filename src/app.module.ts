import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { TeamModule } from './team/team.module';
import config from 'ormconfig'
@Module({
  imports: [
    ConfigModule.forRoot({envFilePath:'.env'}),
    TypeOrmModule.forRoot(config),
    AuthModule,
    TeamModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
