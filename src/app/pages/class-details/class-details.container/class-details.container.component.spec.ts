import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassService } from '../../class/services/class.graphql.service';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { ActivatedRoute } from '@angular/router';
import { ClassDetailsContainerComponent } from './class-details.container.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs-compat';
import { ScheduleDialogData } from '../../../components/schedule/schedule-dialog/schedule-dialog-data.model';

describe('ClassDetailsContainerComponent', () => {
  let component: ClassDetailsContainerComponent;
  let classServiceMock: Partial<ClassService>;
  let scheduleServiceMock: Partial<ScheduleService>;
  let scheduleDialogMock: Partial<MatDialog>;
  let fixture: ComponentFixture<ClassDetailsContainerComponent>;
  const mockedScheduleDialogData = {
    index: '00',
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
    data: {
      classById: {
        _id: '5b217b030825622c97d3757f',
        level: 'א',
        number: 1,
        name: 'טיטאן',
        schedule: [
          {
            index: '10',
            lesson: {
              _id: 'someid',
              title: 'soetitle',
              icon: 'someicon',
            },
          },
        ],
      },
    },
  };
  beforeEach(async () => {
    classServiceMock = {
      classById: jest.fn().mockReturnValue(Promise.resolve(mockedClass)),
      update: jest.fn().mockReturnValue(Promise.resolve({data: {updateClass: {_id: 'updateclassid'}}})),
    };
    scheduleServiceMock = {
      levels: ['א', 'ב', 'ג'],
      daysLabels: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'],
      hoursLabels: [
        '07:30 - 08:00',
        '08:00 - 08:50',
        '08:50 - 09:35',
      ],
    },
    scheduleDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(
          Observable.of(mockedScheduleDialogData),
        ),
      }),
    };
    TestBed.configureTestingModule({
      declarations: [ClassDetailsContainerComponent],
      providers: [
        { provide: ClassService, useValue: classServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '5b217b030825622c97d3757f' } },
          },
        },
        { provide: MatDialog, useValue: scheduleDialogMock },
        { provide: ScheduleService, useValue: scheduleServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassDetailsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toMatchSnapshot();
  });

  it('should open a dialog when onTimeSlotClick is triggered', () => {
    fixture.componentInstance.onTimeSlotClick({hourIndex: 0, dayIndex: 0});
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should call onDetailChange', () => {
    fixture.componentInstance.onDetailChange({name: 'newName', level: 'newlevel'});
    // TODO: you can do better than that
    // expect(fixture.componentInstance._class.level).toBe('newlevel');
  });
});
