import { inject, TestBed } from '@angular/core/testing';
import { SpinnerVisibilityService } from './spinner-visibility.service';

describe('SpinnerVisibilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpinnerVisibilityService],
    });
  });

  it('should be created', inject([SpinnerVisibilityService], (service: SpinnerVisibilityService) => {
    expect(service).toBeTruthy();
  }));

  it('should define a subject', inject([SpinnerVisibilityService], (service: SpinnerVisibilityService) => {
    expect(service.visibilityObservable$).toBeTruthy();
  }));

  it("should pipe 'true' when calling show()", inject(
    [SpinnerVisibilityService],
    (spinner: SpinnerVisibilityService) => {
      spinner.show();
      spinner.visibilityObservable$.subscribe(
        (result) => {
          expect(result).toBeTruthy();
        },
        (error) => {
          expect(true).toBeFalsy();
        },
      );
    },
  ));

  it("should pipe 'false' when calling hide()", inject(
    [SpinnerVisibilityService],
    (spinner: SpinnerVisibilityService) => {
      spinner.hide();
      spinner.visibilityObservable$.subscribe(
        (result) => {
          expect(result).toBeFalsy();
        },
        (error) => {
          expect(true).toBeFalsy();
        },
      );
    },
  ));
});
