import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/db/entity/roles.entity';
import { User } from 'src/db/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Roles])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
