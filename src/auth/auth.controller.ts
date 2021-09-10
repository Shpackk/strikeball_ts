import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Post('/register')
    register(@Body() user: CreateUserDto){
        return this.authService.register(user)
    }
    
    @Post('/login')
    login(@Body() user: LoginUserDto) {
        return this.authService.login(user)
    }
}
