import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @Post('/register')
    async register(@Body() user: RegUserDto) {
        return await this.authService.register(user)
    }
    
    @Post('/login')
    login(@Body() user: LoginUserDto) {
        return this.authService.login(user)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user')
    getUser(@Request() req) {
        return req.user
    }
}
