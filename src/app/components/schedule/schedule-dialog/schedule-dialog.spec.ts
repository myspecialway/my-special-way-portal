import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ScheduleDialogComponent } from './schedule.dialog';
import { LessonService } from '../../../services/lesson/lesson.graphql.service';
import { ScheduleDialogData } from './schedule-dialog-data.model';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSelectChange,
} from '@angular/material';
describe('ScheduleDialogComponent', () => {
  let component: ScheduleDialogComponent;
  let lessonServiceMock: Partial<LessonService>;
  let fixture: ComponentFixture<ScheduleDialogComponent>;
  beforeEach(async () => {
    const mockedLessons = {
      data: {
        lessons: [
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
        ],
      },
    };
    lessonServiceMock = {
      getLessons: jest.fn().mockReturnValue(Promise.resolve(mockedLessons)),
    };
    TestBed.configureTestingModule({
      declarations: [ScheduleDialogComponent],
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
