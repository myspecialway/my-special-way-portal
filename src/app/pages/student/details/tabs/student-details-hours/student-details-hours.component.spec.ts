import { Subscription } from 'rxjs/Subscription';
import { scheduleTestData } from './../../../../../../mocks/assets/schedule.mock';
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
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateCustomLoader } from '../../../../../../mocks/translate.stub';

describe('Student Details Hours Component', () => {
  const sub = new Subscription();
  let scheduleDialogMock: Partial<MatDialog>;
  let component: StudentDetailsHoursComponent;
  let fixture: ComponentFixture<StudentDetailsHoursComponent>;
  let observableAfterClosed: Subject<ScheduleDialogData>;
  let afterClosedMockFn: jest.Mock;
  let studentServiceMock: Partial<StudentService>;
  let mockedScheduleDialogData;
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

  afterEach(() => {
    sub.unsubscribe();
  });

  describe('with _new_ student path', () => {
    it('should render the component as described in snapshot', () => {
      expect(fixture).toMatchSnapshot();
    });
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

  it.skip('should open schedule dialog popup with valid params when onTimeSlotClick', (done) => {
    // given
    // let passedData = {};
    const indexes = { hourIndex: 0, dayIndex: 0 };
    const dialogData = component.getDialogData(indexes);
    scheduleDialogMock.open = jest.fn((comp, config) => {
      expect(config.data).toEqual(dialogData);
      done();
    });
    // when
    component.onTimeSlotClick(indexes);

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

  function setup() {
    observableAfterClosed = new Subject();
    mockedScheduleDialogData = mockedClass.schedule;

    afterClosedMockFn = jest.fn().mockReturnValue(observableAfterClosed);

    scheduleDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: afterClosedMockFn,
      }),
    };

    const mockSchedule = [scheduleTestData];

    studentServiceMock = {
      // getById: jest.fn().mockReturnValue(Promise.resolve({})),
      update: jest.fn(),
      getById: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateCustomLoader,
          },
        }),
      ],
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
              params: Observable.of({ idOrNew: '_new_' }),
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
  }
});
