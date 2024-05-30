import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { catchError, Observable, retry, throwError, timer, EMPTY } from 'rxjs';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {
  constructor(private $localstorage: LocalStorageService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    return next.handle(req).pipe(
      // retry({
      //   count: 2,
      //   delay: (_, retryCount) => timer(retryCount * 1000),
      // }),
      catchError((error) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          console.log('it is from frontend.');
          errorMessage = `===Error: ${error.error.message}`;
        } else {
          console.log('it is from backend.');
          errorMessage = `===Error Code: ${
            error.status
          }\n===Message: ${JSON.stringify(error, null, 3)}`;
        }
        // console.log('error handled by http interceptor:::\n' + errorMessage);
        return throwError(error);
      })
    );
  }
}
