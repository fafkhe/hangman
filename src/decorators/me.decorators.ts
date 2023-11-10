import { createParamDecorator, ExecutionContext } from '@nestjs/common';

console.log("////")
export const Me = createParamDecorator(
  (_: never, context: ExecutionContext) =>
  context.switchToHttp().getRequest().me,
  );

