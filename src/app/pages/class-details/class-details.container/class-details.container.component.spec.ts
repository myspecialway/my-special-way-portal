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

describe('ClassDetailsContainerComponent', () => {
  let component: ClassDetailsContainerComponent;
  let classServiceMock: Partial<ClassService>;
  let scheduleDialogMock: Partial<MatDialog>;
  let fixture: ComponentFixture<ClassDetailsContainerComponent>;
  let afterClosedMockFn: jest.Mock;
  let locationMock: Partial<Location>;
  let routeParamsMockedObservable: Subject<unknown>;
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
  let observableAfterClosed: Subject<ScheduleDialogData>;
  beforeEach(async () => {
    routeParamsMockedObservable = new Subject();
    observableAfterClosed = new Subject();
    afterClosedMockFn = jest.fn().mockReturnValue(observableAfterClosed);
    classServiceMock = {
      classById: jest.fn().mockReturnValue(Promise.resolve(mockedClass)),
      update: jest.fn(),
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
        Router,
        ScheduleService,
        Apollo,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassDetailsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routeParamsMockedObservable.next({ idOrNew: '5b217b030825622c97d3757f' });
  });

  it('should create', () => {
    expect(component).toMatchSnapshot();
  });

  it('should throw an error when faiing to fetch the classById', () => {
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

  it('should throw an error when classService.update failes', () => {
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
});
