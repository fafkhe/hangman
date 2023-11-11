import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { Me } from 'src/decorators/me.decorators';
import { User } from 'src/entities/User.entity';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { serialize } from 'v8';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { singleGameDto } from './Dtos/singleGameDto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @UseGuards(AuthGuard)
  @Post('/start')
  startGame(@Me() me: User) {
    return this.gameService.createGame(me);
  }

  @Serialize(singleGameDto)
  @Get('/single/:id')
  getSinglegame(@Param('id') id: number) {
    return this.gameService.findById(id);
  }
}
