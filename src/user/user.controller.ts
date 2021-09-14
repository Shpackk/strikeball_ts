import { Get, Controller, Post, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/requests')
  getRequests() {
    return this.userService.extractRequests();
  }

  @Post('/forgot-password')
  forgotPassword() {
    return this.userService.forgotPassRequest();
  }

  @Post('/reset-password/:accessToken')
  resetPass(@Param() accesToken: string) {
    return this.userService.resetPassword(accesToken)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  updateProfile() {
    return this.userService.updateInfo()
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  viewProfile() {
    return this.userService.profile()
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/requests/delete/:id')
  deleteRequest(@Param() requestId: number) {
    return this.userService.deleteReq(requestId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  userById(@Param() userId: number) {
    return this.userService.findById(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/ban')
  banUser(@Param() userId: number) {
    return this.userService.banUser(userId)
  }

}
