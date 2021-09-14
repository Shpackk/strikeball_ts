import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Roles } from 'src/db/entity/roles.entity';
import { User } from 'src/db/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports:[TypeOrmModule.forFeature([User, Roles])],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})
export class UserModule {}
