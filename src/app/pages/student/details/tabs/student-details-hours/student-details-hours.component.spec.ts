import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs-compat';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentDetailsHoursComponent } from './student-details-hours.component';
import { StudentDetailsComponent } from '../../student-details.component';

describe('Student Details Hours Component', () => {
  describe('with _new_ student path', () => {
    beforeEach(async () => {

      TestBed.configureTestingModule({
        imports: [
          RouterModule.forRoot([]),
        ],
        declarations: [
          StudentDetailsComponent,
          StudentDetailsHoursComponent,
        ],
        providers: [
          {
            provide: Router, useValue: {
              forRoot: jest.fn(),
            },
          },
          Platform,
          {
            provide: ActivatedRoute, useValue: {
              parent: {
                params: Observable.of({ idOrNew: '_new_' }),
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });
    });

    it('should render the component as described in snapshot', () => {
      const fixture = TestBed.createComponent(StudentDetailsHoursComponent);
      expect(fixture).toMatchSnapshot();
    });
  });
});
