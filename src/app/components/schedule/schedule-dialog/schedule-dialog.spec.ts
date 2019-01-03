import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ScheduleDialogComponent } from './schedule.dialog';
import { LessonService } from '../../../services/lesson/lesson.graphql.service';
import { ScheduleDialogData } from './schedule-dialog-data.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectModule } from '@angular/material';
import { LocationService } from '../../../services/location/location.graphql.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DateUtilService } from '../../../services/date-utils/date-util.service';
describe('ScheduleDialogComponent', () => {
  let component: ScheduleDialogComponent;
  let lessonServiceMock: Partial<LessonService>;
  let locationServiceMock: Partial<LocationService>;
  let fixture: ComponentFixture<ScheduleDialogComponent>;
  beforeEach(async () => {
    const mockedLessons = [
      {
        icon: 'english',
        title: 'אנגלית',
        _id: '5b4506c42c14052bc4abae84',
      },
      {
        icon: 'art',
        title: 'אומנות',
        _id: '5b27f2936a1f7e2d4c77d1d2',
      },
      {
        icon: 'breakfest-icon',
        title: 'ארוחת בוקר',
        _id: '5b41e59a7946d50fa99085e9',
      },
    ];
    const mockedLocations = [
      {
        _id: '5b5596a7739a882933edd508',
        name: '0 מעלית קומה',
        position: {
          floor: 0,
        },
      },
      {
        _id: '5b5596a7739a882933edd509',
        name: '1 מעלית קומה',
        position: {
          floor: 1,
        },
      },
    ];

    lessonServiceMock = {
      getLessons: jest.fn().mockReturnValue(Promise.resolve(mockedLessons)),
    };
    locationServiceMock = {
      getLocations: jest.fn().mockReturnValue(Promise.resolve(mockedLocations)),
    };
    TestBed.configureTestingModule({
      declarations: [ScheduleDialogComponent],
      imports: [FormsModule, MatSelectModule, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: {} },
        { provide: LessonService, useValue: lessonServiceMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            day: 'ראשון',
            hour: '08:00 - 08:50',
          } as ScheduleDialogData,
        },
        { provide: LocationService, useValue: locationServiceMock },
        DateUtilService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
