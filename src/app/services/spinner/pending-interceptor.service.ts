/*
 * The MIT License (MIT)

Copyright (c) 2017-2018 mpalourdio (https://github.com/mpalourdio/ng-http-loader)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ExistingProvider, Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PendingInterceptorService implements HttpInterceptor {
  private _pendingRequests = 0;
  private _pendingRequestsStatus: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  get pendingRequestsStatus$(): Observable<boolean> {
    return this._pendingRequestsStatus.asObservable();
  }

  get pendingRequests(): number {
    return this._pendingRequests;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._pendingRequests++;

    if (1 === this._pendingRequests) {
      this._pendingRequestsStatus.next(true);
    }

    return next.handle(req).pipe(
      map((event) => {
        return event;
      }),
      catchError((error) => {
        return throwError(error);
      }),
      finalize(() => {
        this._pendingRequests--;

        if (0 === this._pendingRequests) {
          this._pendingRequestsStatus.next(false);
        }
      }),
    );
  }
}

export const PendingInterceptorServiceInterceptor: ExistingProvider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useExisting: PendingInterceptorService,
    multi: true,
  },
];
