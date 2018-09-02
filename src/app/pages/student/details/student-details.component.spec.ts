import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatHeaderRow, MatSort } from '@angular/material';
import { StudentDetailsComponent } from './student-details.component';
import { StudentService } from '../services/student.service';
import { Overlay, ScrollStrategyOptions,
  ScrollDispatcher, ViewportRuler,
  OverlayContainer, OverlayPositionBuilder,
  OverlayKeyboardDispatcher,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs-compat';
import {FormsModule} from '@angular/forms';
import {ClassService} from '../../class/services/class.graphql.service';
import {ActivatedRoute, Router, RouterModule, Routes} from '@angular/router';

describe('Student Details Component', () => {
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
          },
        ],
      },
    ];

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterModule.forRoot(routes),
      ],
      declarations: [
        StudentDetailsComponent,
        MatHeaderRow,
        MatRowDef,
        MatHeaderRowDef,
        MatSort,
      ],
      providers: [
        StudentService,
        ClassService,
        { provide: Router, useValue: routerModuleMock },
        Overlay,
        ScrollStrategyOptions,
        ScrollDispatcher,
        Platform,
        ViewportRuler,
        OverlayContainer,
        OverlayPositionBuilder,
        OverlayKeyboardDispatcher,
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
            params: Observable.of({idOrNew: '_new_'}),
          },
          },
        ],
      });
    });

    it('should render the component as described in snapshot', () => {
      const fixture = TestBed.createComponent(StudentDetailsComponent);
      expect(fixture).toMatchSnapshot();
    });

  });

  describe('with edit student path', () => {
    beforeEach(async () => {

      TestBed.configureTestingModule({
        providers: [
          {
            provide: ActivatedRoute, useValue: {
            params: Observable.of({idOrNew: '66'}),
          },
          },
        ],
      });
    });

    it('should render the component as described in snapshot', () => {
      const fixture = TestBed.createComponent(StudentDetailsComponent);
      expect(fixture).toMatchSnapshot();
    });

  });
});
