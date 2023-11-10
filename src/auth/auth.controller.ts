import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { craeteUserDto } from './dtos/createUser.dto';
import { Me } from 'src/decorators/me.decorators';
import { User } from 'src/entities/User.entity';
import { AuthGuard } from 'src/gaurds/auth.gaurd';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() body: craeteUserDto) {
    return this.authService.createUser(body);
  }

  @Post('login')
  login(@Body() body: craeteUserDto) {
    return this.authService.login(body);
  }
  
  @UseGuards(AuthGuard)
  @Get('me')
  me(@Me() me: User) {
    console.log('me is called', me);
    return me;
  }
}
