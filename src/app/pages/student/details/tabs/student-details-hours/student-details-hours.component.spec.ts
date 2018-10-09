import { Subscription } from 'rxjs/Subscription';
import { scheduleTestData } from './../../../../../../mocks/assets/schedule.mock';
import { ComponentFixture } from '../../../../../../../node_modules/@angular/core/testing';

jest.mock('../../../services/student.service');

import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable, Subject } from 'rxjs-compat';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentDetailsHoursComponent } from './student-details-hours.component';
import { StudentDetailsComponent } from '../../student-details.component';
import { StudentService } from '../../../services/student.service';
import { ScheduleService } from '../../../../../services/schedule/schedule.service';
import { MatDialog } from '@angular/material';
import { ScheduleDialogData } from '../../../../../components/schedule/schedule-dialog/schedule-dialog-data.model';

describe('Student Details Hours Component', () => {
  let scheduleDialogMock: Partial<MatDialog>;
  let fixture: ComponentFixture<StudentDetailsHoursComponent>;
  let component: StudentDetailsHoursComponent;
  let observableAfterClosed: Subject<ScheduleDialogData>;
  let afterClosedMockFn: jest.Mock;
  let studentServiceMock: Partial<StudentService>;

  describe('with new student path', () => {
    const sub = new Subscription();
    const mockedScheduleDialogData = {
      index: '0_0',
      lesson: {
        _id: '5b2abc74572e7619a628c11c',
        title: 'test lesson',
        icon: 'test-icon',
      },
      location: {
        _id: '5b5596a7739a882933edd4fc',
        disabled: false,
        name: 'test location',
        position: {
          latitude: 0,
          longitude: 0,
          floor: 1,
        },
      },
    } as ScheduleDialogData;

    const mockSchedule = [scheduleTestData];

    beforeEach(async () => {
      observableAfterClosed = new Subject<ScheduleDialogData>();

      afterClosedMockFn = jest.fn().mockReturnValue(observableAfterClosed);
      scheduleDialogMock = {
        open: jest.fn().mockReturnValue({
          afterClosed: afterClosedMockFn,
        }),
      };
      studentServiceMock = {
        // getById: jest.fn().mockReturnValue(Promise.resolve({})),
        update: jest.fn(),
        getById: jest.fn(),
      };

      TestBed.configureTestingModule({
        imports: [RouterModule.forRoot([])],
        declarations: [StudentDetailsComponent, StudentDetailsHoursComponent],
        providers: [
          { provide: MatDialog, useValue: scheduleDialogMock },
          {
            provide: Router,
            useValue: {
              forRoot: jest.fn(),
            },
          },
          Platform,
          { provide: StudentService, useValue: studentServiceMock },
          ScheduleService,
          {
            provide: ActivatedRoute,
            useValue: {
              parent: {
                params: Observable.of({ idOrNew: 'new' }),
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      fixture = TestBed.createComponent(StudentDetailsHoursComponent);
      component = fixture.componentInstance;
      component.schedule = mockSchedule;
      fixture.detectChanges();
    });

    afterEach(() => {
      sub.unsubscribe();
    });

    it('should render the component as described in snapshot', () => {
      expect(fixture).toMatchSnapshot();
    });

    it('should open schedule dialog popup when onTimeSlotClick', () => {
      // given

      // when
      component.onTimeSlotClick({ hourIndex: 0, dayIndex: 0 });

      // then
      expect(scheduleDialogMock.open).toBeCalled();
    });

    it('should trigger student service update the class when schedule dialog is closed with data', (done) => {
      // given
      // (studentServiceMock.update as jest.Mock).mockResolvedValueOnce(Promise.resolve({ _id: 'updateclassid' }));

      // when
      component.onTimeSlotClick({ hourIndex: 0, dayIndex: 0 });
      let called = false;

      sub.add(
        (studentServiceMock.update = jest.fn(() => {
          called = true;
          done();
        })),
      );
      observableAfterClosed.next(mockedScheduleDialogData);

      // then
      expect(called).toBeTruthy();
    });

    it('should call student service getById when schedule dialog is closed with data', (done) => {
      // given
      let called = false;

      sub.add(
        (studentServiceMock.getById = jest.fn(() => {
          called = true;
          done();
        })),
      );

      // when
      component.onTimeSlotClick({ hourIndex: 0, dayIndex: 0 });
      observableAfterClosed.next(mockedScheduleDialogData);

      // then
      expect(called).toBeTruthy();
    });

    it('should call scheduleservice buildScheduleFromTimeslots when schedule dialog is closed with data', (done) => {
      // given
      let called = false;

      sub.add(
        (component.scheduleService.buildScheduleFromTimeslots = jest.fn(() => {
          called = true;
          done();
        })),
      );

      // when
      component.onTimeSlotClick({ hourIndex: 0, dayIndex: 0 });

      observableAfterClosed.next(mockedScheduleDialogData);

      // then
      expect(called).toBeTruthy();
    });
  });
});
