import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/entities/game.entity';
import { User } from 'src/entities/User.entity';
import { HttpService } from '@nestjs/axios/dist';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import axios from 'axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    private readonly httpService: HttpService,
  ) {}

  async getRandomWord(): Promise<string> {
    try {
      const res = await axios.get('https://api.api-ninjas.com/v1/randomword', {
        headers: {
          'X-API-KEY': 'vifntiKj4ScBhiS6x3pBvA==cOFr6Q1AT3yAgN4C',
        },
      });
      if (res.data && res.data.word) {
        return res.data.word;
      }

      throw new InternalServerErrorException('this is our fault!!');
    } catch (error) {
      console.log('error is here ', error);
      throw new InternalServerErrorException('this is our fault!!');
    }
  }

  async createGame(me: User) {
    const userId = me.id;
    const secretWord = await this.getRandomWord();
    const newGame = await this.gameRepo.create({
      userId: userId,
      secretWord: secretWord,
    });

    await this.gameRepo.save(newGame);

    return newGame;
  }
}
