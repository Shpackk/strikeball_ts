import { Get, Controller, Post, Param, Patch, Delete, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';

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
  updateProfile() {
    return this.userService.updateInfo()
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
    
  }

  @Get('/requests')
  adminManagerRequests() {
    return this.userService.requests()
  }

  @Get('/users')
  getAllUsers() {
    
  }

  @Patch('/requests/:id')
  populateReq(@Body() decision, @Param() req) {
    return this.userService.populateReq(decision.approved, req.id)
  }

  @Get('/manager/:id')
  findOneManager() {
    
  }

}
