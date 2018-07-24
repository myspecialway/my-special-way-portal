import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs-compat';
import {ActivatedRoute, Router, RouterModule, Routes} from '@angular/router';
import {StudentDetailsHoursComponent} from './student-details-hours.component';
import {StudentDetailsComponent} from '../../student-details.component';

describe('Student Details Hours Component', () => {
  let routerModuleMock: Partial<RouterModule>;

  beforeEach(async () => {

    routerModuleMock = {
      forRoot: jest.fn(),
      forChild: jest.fn(),
      navigate: jest.fn(),
    };

    const routes: Routes = [
      { path: '', redirectTo: 'student', pathMatch: 'full' },
      {
        path: '',
        children: [
          { path: 'student/:idOrNew', component: StudentDetailsComponent,
            children: [
              { path: 'hours', component: StudentDetailsHoursComponent},
            ],
          },
        ],
      },
    ];

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes),
      ],
      declarations: [
        StudentDetailsComponent,
        StudentDetailsHoursComponent,
      ],
      providers: [
        { provide: Router, useValue: routerModuleMock },
        Platform,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  describe('with _new_ student path', () => {
    beforeEach(async () => {

      TestBed.configureTestingModule({
        providers: [
          {
            provide: ActivatedRoute, useValue: {
            parent: {
              params: Observable.of({idOrNew: '_new_'}),
            },
          },
          },
        ],
      });
    });

    it('should render the component as described in snapshot', () => {
      const fixture = TestBed.createComponent(StudentDetailsHoursComponent);
      expect(fixture).toMatchSnapshot();
    });
  });
});
