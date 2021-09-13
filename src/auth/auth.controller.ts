import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegUserDto } from './dto/register-user.dto';

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

}
