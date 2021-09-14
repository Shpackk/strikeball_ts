import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    TeamModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
