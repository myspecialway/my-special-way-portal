import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';

jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassService } from '../../class/services/class.graphql.service';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassDetailsContainerComponent } from './class-details.container.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs-compat';
import { ScheduleDialogData } from '../../../components/schedule/schedule-dialog/schedule-dialog-data.model';
import { Location } from '@angular/common';
import { MSWSnackbar } from '../../../services/msw-snackbar/msw-snackbar.service';
import { Apollo } from 'apollo-angular';
import { DateUtilService } from '../../../services/date-utils/date-util.service';

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
        name: 'test location',
        position: {
          floor: 1,
        },
      },
    },
  ],
};

describe('ClassDetailsContainerComponent', () => {
  let component: ClassDetailsContainerComponent;
  let classServiceMock: Partial<ClassService>;
  let scheduleDialogMock: Partial<MatDialog>;
  let dateUtilServiceMock: Partial<DateUtilService>;
  let fixture: ComponentFixture<ClassDetailsContainerComponent>;
  let afterClosedMockFn: jest.Mock;
  let locationMock: Partial<Location>;
  let routeParamsMockedObservable: Subject<undefined>;
  let watchQueryMockedObservable: Subject<any>;

  const mockedScheduleDialogData = {
    index: '0_0',
    lesson: {
      _id: '5b2abc74572e7619a628c11c',
      title: 'test lesson',
      icon: 'test-icon',
    },
    location: {
      _id: '5b5596a7739a882933edd4fc',
      name: 'test location',
      position: {
        floor: 1,
      },
    },
  } as ScheduleDialogData;

  let observableAfterClosed: Subject<ScheduleDialogData>;
  beforeEach(async () => {
    routeParamsMockedObservable = new Subject();
    observableAfterClosed = new Subject();
    afterClosedMockFn = jest.fn().mockReturnValue(observableAfterClosed);
    classServiceMock = {
      classById: jest.fn().mockReturnValue(Promise.resolve(mockedClass)),
      update: jest.fn(),
      create: jest.fn(),
    };
    dateUtilServiceMock = {
      isTemporeryClassTimeExpired: jest.fn().mockReturnValue(false),
    };
    scheduleDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: afterClosedMockFn,
      }),
    };
    locationMock = {
      replaceState: jest.fn(),
    };
    const mswSnackbarMock = {
      displayTimedMessage: jest.fn(),
    } as Partial<MSWSnackbar>;

    watchQueryMockedObservable = new Subject();
    const apolloMock = {
      watchQuery: () => ({
        valueChanges: watchQueryMockedObservable,
      }),
    };

    TestBed.configureTestingModule({
      declarations: [ClassDetailsContainerComponent],
      providers: [
        { provide: ClassService, useValue: classServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: routeParamsMockedObservable,
          },
        },
        { provide: MatDialog, useValue: scheduleDialogMock },
        { provide: Location, useValue: locationMock },
        { provide: MSWSnackbar, useValue: mswSnackbarMock },
        { provide: DateUtilService, useValue: dateUtilServiceMock },
        Router,
        ScheduleService,
        { provide: Apollo, useValue: apolloMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassDetailsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routeParamsMockedObservable.next({ idOrNew: '5b217b030825622c97d3757f' });
    watchQueryMockedObservable.next({
      data: {
        userProfile: {
          username: 'test',
          firstname: 'MSW',
          lastname: 'PRINCIPLE',
          role: 'PRINCIPLE',
          class_id: 'some_classid',
        },
      },
    });
  });

  it('should create', () => {
    expect(component).toMatchSnapshot();
  });

  it('should throw an error when failing to fetch the classById', () => {
    (classServiceMock.classById as jest.Mock).mockRejectedValueOnce('some error');
    fixture = TestBed.createComponent(ClassDetailsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    console.log(fixture.componentInstance._class);
    expect(fixture.componentInstance._class).not.toBeDefined();
  });

  it('should regenerate the class when classService.update succeeds', () => {
    // given
    (classServiceMock.update as jest.Mock).mockResolvedValueOnce({ _id: 'updateclassid' });

    // when
    fixture.componentInstance.onTimeSlotClick({ hourIndex: 0, dayIndex: 0 });

    observableAfterClosed.next(mockedScheduleDialogData);

    // then
    expect(classServiceMock.update).toHaveBeenCalled();
  });

  it('should throw an error when classService.update fails', () => {
    (classServiceMock.update as jest.Mock).mockRejectedValueOnce('some error');
    fixture.componentInstance.onTimeSlotClick({ hourIndex: 0, dayIndex: 0 });
    observableAfterClosed.next(mockedScheduleDialogData);
    expect(fixture.componentInstance.onTimeSlotClick).toThrowError();
  });

  it('should not call classService.update when dismissing the dialog', () => {
    fixture.componentInstance.onTimeSlotClick({ hourIndex: 1, dayIndex: 0 });
    observableAfterClosed.next(undefined);
    expect(classServiceMock.update).not.toHaveBeenCalled();
  });

  it('should call onDetailChange', () => {
    (classServiceMock.update as jest.Mock).mockResolvedValueOnce({ data: { updateClass: { _id: 'updateclassid' } } });
    fixture.componentInstance.onDetailChange({ name: 'newName', grade: 'a' });
    const updatedClass = { ...mockedClass, name: 'newName', grade: 'a' };
    expect(classServiceMock.update).toHaveBeenCalledWith(updatedClass);
  });

  it('should throw an error when class service fails to update', () => {
    (classServiceMock.update as jest.Mock).mockRejectedValueOnce('some error');
    fixture.componentInstance.onDetailChange({ name: 'newName', grade: 'a' });
    expect(fixture.componentInstance.onDetailChange).toThrowError();
  });

  it('should show an error when class already exists', () => {
    (classServiceMock.create as jest.Mock).mockRejectedValueOnce(new Error('class already exists'));
    fixture = TestBed.createComponent(ClassDetailsContainerComponent);
    fixture.componentInstance.isNew = true;
    fixture.componentInstance.onDetailChange({ name: 'newName', grade: 'a' });
    expect(fixture.componentInstance._class).not.toBeDefined();
  });
});

//we need under describe in order to provide deleteTimeSlotDialogMock as MatDialog
describe('ClassDetailsContainerComponent - delete time slot from class', () => {
  let classServiceMock: Partial<ClassService>;
  let deleteTimeSlotDialogMock: Partial<MatDialog>;
  let fixture: ComponentFixture<ClassDetailsContainerComponent>;
  let afterCloseDeleteTimeSlotDialogMockFn: jset.Mock;
  let routeParamsMockedObservable: Subject<unknown>;
  let dateUtilServiceMock: Partial<DateUtilService>;

  const mockedTimeSlotIndexes = {
    hourIndex: 1,
    dayIndex: 1,
  } as TimeSlotIndexes;

  let observableDeleteTimeSlotDialogComponent: Subject<TimeSlotIndexes>;

  beforeEach(async () => {
    routeParamsMockedObservable = new Subject();
    observableDeleteTimeSlotDialogComponent = new Subject();
    afterCloseDeleteTimeSlotDialogMockFn = jest.fn().mockReturnValue(observableDeleteTimeSlotDialogComponent);
    classServiceMock = {
      classById: jest.fn().mockReturnValue(Promise.resolve(mockedClass)),
      update: jest.fn(),
      deleteScheduleSlotFromClass: jest.fn(),
    };
    dateUtilServiceMock = {
      isTemporeryClassTimeExpired: jest.fn().mockReturnValue(false),
    };
    deleteTimeSlotDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: afterCloseDeleteTimeSlotDialogMockFn,
      }),
    };

    const mswSnackbarMock = {
      displayTimedMessage: jest.fn(),
    } as Partial<MSWSnackbar>;

    TestBed.configureTestingModule({
      declarations: [ClassDetailsContainerComponent],
      providers: [
        { provide: ClassService, useValue: classServiceMock },
        { provide: ActivatedRoute, useValue: { params: routeParamsMockedObservable } },
        { provide: MatDialog, useValue: deleteTimeSlotDialogMock },
        { provide: MSWSnackbar, useValue: mswSnackbarMock },
        { provide: DateUtilService, useValue: dateUtilServiceMock },

        Router,
        ScheduleService,
        { provide: Apollo, useClass: Apollo },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassDetailsContainerComponent);
    fixture.detectChanges();
    routeParamsMockedObservable.next({ idOrNew: '5b217b030825622c97d3757f' });
  });

  it('should delete the lesson when classService.deleteScheduleSlotFromClass succeeds', () => {
    deleteTimeSlotDialogMock.open = jest.fn().mockReturnValue({
      afterClosed: afterCloseDeleteTimeSlotDialogMockFn,
    });
    // given
    (classServiceMock.deleteScheduleSlotFromClass as jest.Mock).mockResolvedValueOnce({
      data: { updateClass: { _id: 'updateclassid' } },
    });

    // when
    fixture.componentInstance.onTimeSlotDelete({ hourIndex: 1, dayIndex: 1 });

    observableDeleteTimeSlotDialogComponent.next(mockedTimeSlotIndexes);

    // then
    expect(classServiceMock.deleteScheduleSlotFromClass).toHaveBeenCalled();
  });

  it('should throw an error when classService.deleteScheduleSlotFromClass fails', () => {
    (classServiceMock.deleteScheduleSlotFromClass as jest.Mock).mockRejectedValueOnce('some error');
    fixture.componentInstance.onTimeSlotDelete({ hourIndex: 1, dayIndex: 1 });
    observableDeleteTimeSlotDialogComponent.next(mockedTimeSlotIndexes);
    expect(fixture.componentInstance.onTimeSlotDelete).toThrowError();
  });

  it('should not call classService.deleteScheduleSlotFromClass when dismissing the dialog', () => {
    fixture.componentInstance.onTimeSlotDelete({ hourIndex: 1, dayIndex: 1 });
    observableDeleteTimeSlotDialogComponent.next(undefined);
    expect(classServiceMock.deleteScheduleSlotFromClass).not.toHaveBeenCalled();
  });
});
