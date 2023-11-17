import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, Status } from 'src/entities/game.entity';
import { User } from 'src/entities/User.entity';
import { HttpService } from '@nestjs/axios/dist';
import axios from 'axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GameQueryDto } from './Dtos/GameQueryDto';
import { GuessLetterDto } from './Dtos/guessLetterDto';
import { dashify } from './utils/dashifystring';

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
        return res.data.word.toLowerCase();
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

    const result = await this.gameRepo.find({
      where: { id: newGame.id },
      relations: ['user'],
    });

    return result;
  }

  async findById(id: number) {
    const thisGame = await this.gameRepo.findOne({
      where: {
        id: id,
      },
      relations: ['user'],
    });
    if (!thisGame) {
      throw new BadRequestException('this game is not exist');
    }
    return thisGame;
  }

  async myGames(me: User, query: GameQueryDto) {
    const limit = query.limit || 10;
    const skip = query.page * limit || 0;

    const thisUser = me.id;

    const [res, total] = await this.gameRepo.findAndCount({
      where: { userId: thisUser },
      relations: ['user'],
      take: limit,
      skip,
    });
    return {
      res,
      total,
    };
  }

  async guessLetter(body: GuessLetterDto, me: User) {
    let alphaExp = /^[a-zA-Z]+$/;
    const { guessletter, gameId } = body;

    const thisGame = await this.gameRepo.findOne({
      where: { id: gameId },
      relations: ['user'],
    });
    if (!thisGame) {
      throw new BadRequestException('no such game found!!');
    }
    if (thisGame.userId !== me.id) throw new ForbiddenException('forbiden!!');

    if (thisGame.chances < 1 || thisGame.status !== Status.Ongoing) {
      throw new BadRequestException(
        'the game is over, please start a new game',
      );
    }

    if (!guessletter.match(alphaExp)) {
      throw new BadRequestException('Please enter only alphabets');
    }

    if (thisGame.guessletters.includes(guessletter)) {
      throw new BadRequestException('you already chose this letter ');
    }

    if (guessletter.length !== 1) {
      throw new BadRequestException('please provide a single letter');
    }

    if (!thisGame.secretWord.includes(guessletter)) {
      thisGame.chances = thisGame.chances - 1;
    }
    thisGame.guessletters += guessletter;

    const dashifiedString = dashify(thisGame.guessletters, thisGame.secretWord);

    if (dashifiedString.includes('-') && thisGame.chances === 0) {
      thisGame.status = Status.Lost;
      this.gameRepo.save(thisGame);
      return `"You lost the correct word was ${thisGame.secretWord} !!"`;
    }

    if (!dashifiedString.includes('-')) {
      thisGame.status = Status.Won;
      this.gameRepo.save(thisGame);
      return 'You Won !!';
    }

    await this.gameRepo.save(thisGame);

    return thisGame;
  }

  async statistics(me: User) {
    const result = {
      total: 0,
      Ongoing: 0,
      Won: 0,
      Lost: 0
    };

    const theseGames = await this.gameRepo.find({
      where: {
        userId: me.id,
      },
    });

    theseGames.forEach((item) => {
      result.total++;
      if (!result[item.status]) result[item.status] = 0;
      result[item.status]++;
    });

    return result;

  
  }
}
