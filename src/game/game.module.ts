import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/entities/game.entity';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entities/User.entity';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports:[HttpModule,TypeOrmModule.forFeature([Game,User])],
  controllers: [GameController],
  providers: [GameService,AuthService]
})
export class GameModule {}
