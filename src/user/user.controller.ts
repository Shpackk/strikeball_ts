import { Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get('/managers')
    getManagers() {
        
    }
    
    @Get('/requests')
    getRequests() {
        
    }

    @Post('/forgot-password')
    forgotPass() {
        
    }

    @Post('/reset-password/:accessToken')
    resetPass(@Param('accessToken') accessToken) {
        console.log(accessToken)
    }

    @Patch('/update')
    updateProfile() {
        
    }

    @Get('/requests')
    viewRequests() {
        
    }
}
