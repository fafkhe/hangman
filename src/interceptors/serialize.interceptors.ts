import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer'

interface ClassConstuctor {
  new (...args: any[]): {}
}


export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: ClassConstuctor) {};

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    
    // run something before a request is handled
    // by the request handler

    return next.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true
        })
      })
    )
  }
}

export function Serialize(dto: ClassConstuctor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

