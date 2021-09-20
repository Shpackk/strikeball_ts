import { Get, Controller, Post, Param, Patch, Delete, UseGuards, Request, Body, UseInterceptors, UploadedFile, ParseIntPipe, Query, ParseBoolPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/passport/jwtauth/jwt-auth.guard';
import { UserService } from './user.service';
import { imageFileFilter,fileNameGen } from 'src/services/fileUploadHandler';
import { UserForReset } from './DTO/userPassReset';
import { UpdateProfileBody } from './DTO/updateProfileBody.dto';
import { TokenPassReset } from './DTO/tokeToResetPass.dto';
import { BanInfo } from './DTO/banInfo.dto';
import { PassReset } from './DTO/resetPass.dto';
import { User } from 'src/db/entity/user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Post('user/forgot-password')
  forgotPassword(@Body() user: UserForReset) {
    return this.userService.forgotPassRequest(user.email);
  }
  //done
  @UseGuards(JwtAuthGuard)
  @Get('user/requests')
  getRequests(@Request() req) {
    return this.userService.extractRequests(req.user);
  }


  @Post('user/reset-password/:accessToken')
  resetPass(@Param('accessToken') accesToken: TokenPassReset, @Body() body: PassReset) {
    return this.userService.resetPassword(accesToken, body)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/update')
  @UseInterceptors(FileInterceptor('picture', {
    storage: diskStorage({
      destination: './uploads/',
      filename: fileNameGen,
    }),
    fileFilter: imageFileFilter
  }))
  async updateProfile(@Body() body: UpdateProfileBody, @UploadedFile() file: Express.Multer.File, @Request() req): Promise<void> {
    return await this.userService.updateInfo(body, file, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/profile')
  async viewProfile(@Request() req): Promise<User> {
    return await this.userService.profile(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/requests/delete/:id')
  async deleteRequest(@Param('id', ParseIntPipe) requestId: number, @Request() req): Promise<Object> {
    return await this.userService.deleteReq(requestId, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async userById(@Param('id', ParseIntPipe) user): Promise<User> {
    return await this.userService.findById(user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/:id/ban')
  async banUser(@Param('id', ParseIntPipe) userId: number, @Body() banInfo: BanInfo): Promise<Object> {
    return await this.userService.banUser(userId, banInfo)
  }

  @Get('/managers')
  async getManagers(): Promise<User[]> {
    return await this.userService.allManagers()
  }

  @Get('/requests')
  async adminManagerRequests(): Promise<Array<Object>> {
    return await this.userService.requests()
  }

  @Get('/users/:team?')
  async getAllUsers(@Query('team') teamId): Promise<Array<Object>>{
    return await this.userService.findAll(teamId)
  }

  @Patch('/requests/:id')
  async populateReq(@Body('approved',ParseBoolPipe) decision, @Param() req): Promise<Object> {
    return await this.userService.populateReq(decision, req.id)
  }

  @Get('/manager/:id')
  async findOneManager(@Param('id', ParseIntPipe) userId): Promise<Object> {
    return await this.userService.getOneManager(userId)
  }

}
