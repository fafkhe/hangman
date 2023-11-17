import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GameService } from './game.service';
import { Me } from 'src/decorators/me.decorators';
import { User } from 'src/entities/User.entity';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { singleGameDto } from './Dtos/singleGameDto';
import { GameQueryDto } from './Dtos/GameQueryDto';
import { GuessLetterDto } from './Dtos/guessLetterDto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Serialize(singleGameDto)
  @UseGuards(AuthGuard)
  @Post('/start')
  startGame(@Me() me: User) {
    return this.gameService.createGame(me);
  }

  @Serialize(singleGameDto)
  @UseGuards(AuthGuard)
  @Post('/guessletter')
  guess(@Body() body: GuessLetterDto, @Me() me:User) {
    return this.gameService.guessLetter(body,me);
  }

  @Serialize(singleGameDto)
  @Get('/single/:id')
  getSinglegame(@Param('id') id: number) {
    
    return this.gameService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Get('/mygames')
  getMyGames(@Me() me: User, @Query() query: GameQueryDto) {
    return this.gameService.myGames(me, query);
  }

  @UseGuards(AuthGuard)
  @Get('statistics/:userid')
  game_statistics(@Me() me: User) {
    return this.gameService.statistics(me);
  }
}
