import { Body, Controller, Get, Post, Request, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { fileNameGen, imageFileFilter } from 'src/services/fileUploadHandler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @Post('/register')
    @UseInterceptors(FileInterceptor('picture', {
        storage: diskStorage({
            destination: './uploads/',
            filename: fileNameGen,
        }),
    fileFilter: imageFileFilter
  }))
    async register(@Body() user: RegUserDto, @UploadedFile() file: Express.Multer.File) {
        return await this.authService.register(user,file)
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
