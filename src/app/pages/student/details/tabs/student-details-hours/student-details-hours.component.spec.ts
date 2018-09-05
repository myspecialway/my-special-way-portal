jest.mock('../../../services/student.service');

import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs-compat';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentDetailsHoursComponent } from './student-details-hours.component';
import { StudentDetailsComponent } from '../../student-details.component';
import { StudentService } from '../../../services/student.service';
import { ScheduleService } from '../../../../../services/schedule/schedule.service';
import { MatDialog } from '@angular/material';

describe('Student Details Hours Component', () => {
  let scheduleDialogMock: Partial<MatDialog>;
  describe('with _new_ student path', () => {
    beforeEach(async () => {
      scheduleDialogMock = {
        open: jest.fn().mockReturnValue({
          afterClosed: jest.fn(),
        }),
      };

      TestBed.configureTestingModule({
        imports: [
          RouterModule.forRoot([]),
        ],
        declarations: [
          StudentDetailsComponent,
          StudentDetailsHoursComponent,
        ],
        providers: [
          { provide: MatDialog, useValue: scheduleDialogMock },
          {
            provide: Router, useValue: {
              forRoot: jest.fn(),
            },
          },
          Platform,
          StudentService,
          ScheduleService,
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
