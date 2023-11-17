import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { craeteUserDto } from './dtos/createUser.dto';
import { Me } from 'src/decorators/me.decorators';
import { User } from 'src/entities/User.entity';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { singleUserDto } from './dtos/singleUserDto';

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

  
  @Serialize(singleUserDto)
  @UseGuards(AuthGuard)
  @Get('singleuser/:id')
  getSingleUser(@Param('id') id: number) {
    return this.authService.findById(id);
  }
}
