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

import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { merge, Observable, Subscription, timer } from 'rxjs';
import { debounce, distinctUntilChanged, partition, switchMap } from 'rxjs/operators';
import { PendingInterceptorService } from '../../services/spinner/pending-interceptor.service';
import { SpinnerVisibilityService } from '../../services/spinner/spinner-visibility.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  @Input()
  isSpinnerVisible: boolean;
  private subscriptions: Subscription;
  private visibleUntil: number = Date.now();

  constructor(
    private pendingInterceptorService: PendingInterceptorService,
    private spinnerVisibilityService: SpinnerVisibilityService,
  ) {
    const [showSpinner$, hideSpinner$] = partition((h: boolean) => h)(
      this.pendingInterceptorService.pendingRequestsStatus$,
    );

    this.subscriptions = merge(
      this.pendingInterceptorService.pendingRequestsStatus$.pipe(switchMap(() => showSpinner$)),
      showSpinner$.pipe(switchMap(() => hideSpinner$.pipe(debounce(() => this.getVisibilityTimer())))),
      this.spinnerVisibilityService.visibilityObservable$,
    )
      .pipe(distinctUntilChanged())
      .subscribe((h) => this.handleSpinnerVisibility(h));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private handleSpinnerVisibility(showSpinner: boolean): void {
    if (showSpinner) {
      this.visibleUntil = Date.now();
    }
    this.isSpinnerVisible = showSpinner;
  }

  private getVisibilityTimer(): Observable<number> {
    return timer(this.visibleUntil - Date.now());
  }
}
