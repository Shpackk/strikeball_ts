import { Get, Controller, Post, Param, Patch, Delete, UseGuards, Request, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { UserService } from './user.service';
import { imageFileFilter,fileNameGen } from 'src/services/fileUploadHandler';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Post('user/forgot-password')
  forgotPassword(@Body() user) {
    return this.userService.forgotPassRequest(user.email);
  }
  //done
  @UseGuards(JwtAuthGuard)
  @Get('user/requests')
  getRequests(@Request() req) {
    return this.userService.extractRequests(req.user);
  }


  @Post('user/reset-password/:accessToken')
  resetPass(@Param() accesToken, @Body() body) {
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
  updateProfile(@Body() body, @UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.userService.updateInfo(body,file, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/profile')
  viewProfile(@Request() req) {
    return this.userService.profile(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/requests/delete/:id')
  deleteRequest(@Param() request, @Request() req) {
    return this.userService.deleteReq(request.id, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  userById(@Param() userId: number) {
    return this.userService.findById(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/:id/ban')
  banUser(@Param() user, @Body() banInfo) {
    return this.userService.banUser(user.id, banInfo)
  }

  @Get('/managers')
  getManagers() {
    return this.userService.allManagers()
  }

  @Get('/requests')
  adminManagerRequests() {
    return this.userService.requests()
  }

  @Get('/users/:id?')
  getAllUsers(@Param() team) {
    return this.userService.findAll(team.id)
  }

  @Patch('/requests/:id')
  populateReq(@Body() decision, @Param() req) {
    return this.userService.populateReq(decision.approved, req.id)
  }

  @Get('/manager/:id')
  findOneManager(@Param() user) {
    return this.userService.getOneManager(user.id)
  }

}
