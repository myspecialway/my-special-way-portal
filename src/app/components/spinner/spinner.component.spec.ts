import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './spinner.component';
import { async, TestBed, ComponentFixture, tick, fakeAsync, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PendingInterceptorServiceInterceptor } from '../../services/spinner/pending-interceptor.service';
import { By } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

const spinnerTagName = 'app-spinner';
@Component({
  template: `<${spinnerTagName}></${spinnerTagName}>`,
})
export class ComponentWithSpinnerComponent {}

describe('spinner component', () => {
  let spinnerComponent: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpinnerComponent, ComponentWithSpinnerComponent],
      imports: [HttpClientTestingModule, MatProgressSpinnerModule],
      providers: [PendingInterceptorServiceInterceptor],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    spinnerComponent = fixture.componentInstance;
  });

  it('should create the spinner component', () => {
    expect(spinnerComponent).toBeTruthy();
  });

  it('should destroy spinner as a view dependency without error', () => {
    const fixtureWithLoader = TestBed.createComponent(ComponentWithSpinnerComponent);
    const componentWithLoader = fixtureWithLoader.componentInstance;
    expect(componentWithLoader).toBeTruthy();

    const element = fixtureWithLoader.debugElement.query(By.css(`${spinnerTagName}`));
    expect(element).toBeTruthy();
  });

  it('should not display anything by default', () => {
    const element = fixture.debugElement.query(By.css(`${spinnerTagName}`));

    expect(element).toBeNull();
  });

  it('should show and hide the spinner according to the pending HTTP requests', fakeAsync(
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      function runQuery(url: string): Observable<any> {
        return http.get(url);
      }

      forkJoin([runQuery('/fake'), runQuery('/fake2')]).subscribe();

      const firstRequest = httpMock.expectOne('/fake');
      const secondRequest = httpMock.expectOne('/fake2');

      tick();
      expect(spinnerComponent.isSpinnerVisible).toBeTruthy();
      firstRequest.flush({});

      tick();
      expect(spinnerComponent.isSpinnerVisible).toBeTruthy();
      secondRequest.flush({});

      tick();
      expect(spinnerComponent.isSpinnerVisible).toBeFalsy();
    }),
  ));

  it('should hide and show the spinner for a single HTTP request', fakeAsync(
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      http.get('/fake').subscribe();

      tick();
      expect(spinnerComponent.isSpinnerVisible).toBeTruthy();
      httpMock.expectOne('/fake').flush({});

      tick();
      expect(spinnerComponent.isSpinnerVisible).toBeFalsy();
    }),
  ));
});
