import { ScheduleDialogComponent } from './../../../../../components/schedule/schedule-dialog/schedule.dialog';
import { ScheduleDialogData } from './../../../../../components/schedule/schedule-dialog/schedule-dialog-data.model';
jest.mock('../../../services/student.service');

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable, Subject } from 'rxjs-compat';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentDetailsHoursComponent } from './student-details-hours.component';
import { StudentDetailsComponent } from '../../student-details.component';
import { StudentService } from '../../../services/student.service';
import { ScheduleService } from '../../../../../services/schedule/schedule.service';
import { MatDialog } from '@angular/material';

describe('Student Details Hours Component', () => {
  let scheduleDialogMock: Partial<MatDialog>;
  let component: StudentDetailsHoursComponent;
  let fixture: ComponentFixture<StudentDetailsHoursComponent>;
  let observableAfterClosed: Subject<ScheduleDialogData>;
  let afterClosedMockFn: jest.Mock;

  const mockedIndexes = { hourIndex: 0, dayIndex: 0 };

  const mockedClass = {
    _id: '5b217b030825622c97d3757f',
    grade: 'a',
    name: 'טיטאן',
    schedule: [
      {
        index: '1_0',
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
      },
    ],
  };
  beforeEach(() => {
    setup();
  });

  describe('with any student path', async () => {
    it('should trigger dialog open when onTimeSlotClick', () => {
      const schedule = mockedClass.schedule;
      component.schedule = component.scheduleService.buildScheduleFromTimeslots(
        component.scheduleService.hoursLabels.length,
        component.scheduleService.daysLabels.length,
        schedule,
      );

      component.onTimeSlotClick(mockedIndexes);
      expect(scheduleDialogMock.open).toBeCalled();
    });

    it('should trigger dialog open with dialog data when onTimeSlotClick', () => {
      const schedule = mockedClass.schedule;
      component.schedule = component.scheduleService.buildScheduleFromTimeslots(
        component.scheduleService.hoursLabels.length,
        component.scheduleService.daysLabels.length,
        schedule,
      );
      component.onTimeSlotClick(mockedIndexes);
      expect(scheduleDialogMock.open).toBeCalledWith(ScheduleDialogComponent, {
        data: component.getDialogData(mockedIndexes),
        height: '375px',
        width: '320px',
      });
    });
  });

  describe('with _new_ student path', () => {
    it('should render the component as described in snapshot', () => {
      expect(fixture).toMatchSnapshot();
    });
  });

  function setup() {
    observableAfterClosed = new Subject();
    afterClosedMockFn = jest.fn().mockReturnValue(observableAfterClosed);

    scheduleDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: afterClosedMockFn,
      }),
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
        StudentService,
        { provide: MatDialog, useValue: scheduleDialogMock },
        ScheduleService,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: Observable.of({ idOrNew: '_new_' }),
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    // create component and test fixture
    fixture = TestBed.createComponent(StudentDetailsHoursComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
  }
});
