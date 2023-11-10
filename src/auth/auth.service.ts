import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/User.entity';
import { craeteUserDto } from './dtos/createUser.dto';
import { BadRequestException,InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  #generateToken({ id, password }) {
    return this.jwtService.sign({ id, password });
  }

  async #readSingleUserFromCache(id: number): Promise<User | null> {
    try {
      let target = `user-${String(id)}`;

      let thisUser = (await this.cacheManager.get(target)) as User;
      console.log(thisUser,"thisuser")
      // let thisUser = null;

      if (!thisUser) {
        thisUser = await this.userRepo.findOne({
          where: {
            id,
          },
        });
        if (thisUser) await this.cacheManager.set(target, thisUser, 600 * 1000);
      }

      return thisUser;
    } catch (error) {
      return null;
    }
  }

  async findById(id: number) {
    const thisUser = await this.#readSingleUserFromCache(id);
    if (!thisUser)
      throw new BadRequestException('there is no user with this ID!!');
    return thisUser;
  }

  async createUser(data: craeteUserDto) {
    // const saltOrRounds = 10;
    // const passwordHash = await bcrypt.hash(data.password, saltOrRounds);
    let thisUser = await this.userRepo.findOne({
      where: {
        email: data.email,
      },
    });

    if (thisUser) {
      throw new BadRequestException('this user already exist!!');
    } else {
      const user = this.userRepo.create({ ...data });
      await this.userRepo.save(user);
    }
    return 'ok';
  }

  async login(data: craeteUserDto) {
    let existingUser = await this.userRepo.findOne({
      where: {
        email: data.email,
      },
    });
    if (!existingUser) {
      throw new BadRequestException('this user does not exist!!!');
    }
    console.log(existingUser, '////');
    const isMatch = await bcrypt.compare(data.password, existingUser.password);
    if (isMatch === false) {
      throw new BadRequestException('password does not match!');
    }
    const token = this.#generateToken({
      id: existingUser.id,
      password: existingUser.password,
    });

    return { token };
  }
}
