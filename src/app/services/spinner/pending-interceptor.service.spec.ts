import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { forkJoin, Observable } from 'rxjs';
import { PendingInterceptorService, PendingInterceptorServiceInterceptor } from './pending-interceptor.service';

describe('PendingInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PendingInterceptorServiceInterceptor],
    });
  });

  it('should be created', inject([PendingInterceptorService], (service: PendingInterceptorService) => {
    expect(service).toBeTruthy();
  }));

  it('should be aware of the pending HTTP requests', inject(
    [PendingInterceptorService, HttpClient, HttpTestingController],
    (service: PendingInterceptorService, http: HttpClient, httpMock: HttpTestingController) => {
      function runQuery(url: string): Observable<any> {
        return http.get(url);
      }

      forkJoin([runQuery('/fake'), runQuery('/fake2')]).subscribe();

      const firstRequest = httpMock.expectOne('/fake');
      const secondRequest = httpMock.expectOne('/fake2');

      expect(service.pendingRequests).toBe(2);
      firstRequest.flush({});

      expect(service.pendingRequests).toBe(1);
      secondRequest.flush({});

      expect(service.pendingRequests).toBe(0);

      httpMock.verify();
    },
  ));

  it('should correctly notify the pendingRequestsStatus observable', async(
    inject(
      [PendingInterceptorService, HttpClient, HttpTestingController],
      (service: PendingInterceptorService, http: HttpClient, httpMock: HttpTestingController) => {
        const pendingRequestsStatus = service.pendingRequestsStatus$;

        pendingRequestsStatus.subscribe(
          (next: boolean) => expect(next).toBeTruthy(),
          (error: HttpErrorResponse) => expect(1).toBe(2),
        );

        http.get('/fake').subscribe();
        httpMock.expectOne('/fake');
      },
    ),
  ));

  it('should correctly notify the pendingRequestsStatus observable, even if subscribed after', async(
    inject(
      [PendingInterceptorService, HttpClient, HttpTestingController],
      (service: PendingInterceptorService, http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fake').subscribe();
        httpMock.expectOne('/fake');

        const pendingRequestsStatus = service.pendingRequestsStatus$;
        pendingRequestsStatus.subscribe(
          (next: boolean) => expect(next).toBeTruthy(),
          (error: HttpErrorResponse) => expect(1).toBe(2),
        );
      },
    ),
  ));

  it('should fail correctly', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      const statusText = 'NOT FOUND';

      http
        .get('/fake')
        .subscribe(
          (next: boolean) => expect(true).toBe(false),
          (error: HttpErrorResponse) => expect(error.statusText).toBe(statusText),
        );

      const testRequest = httpMock.expectOne('/fake');
      testRequest.flush(
        {},
        {
          status: 404,
          statusText,
        },
      );
      httpMock.verify();
    },
  ));
});
