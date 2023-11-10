import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const requester = request.requester;

    console.log(requester);
    if (!requester || !requester.id) return false;

    const thisUser = await this.userService.findById(requester._id);

    if (!thisUser) return false;
    request.me = thisUser;

    return true;
  }
}
