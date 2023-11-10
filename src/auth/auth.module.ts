import { Module ,MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtAuthMiddleware } from './jwtAuth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]

})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(jwtAuthMiddleware).forRoutes("*");
  }
}
