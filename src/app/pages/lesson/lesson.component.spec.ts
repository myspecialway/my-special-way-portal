import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LessonComponent } from './lesson.component';
import { LessonService } from '../../services/lesson/lesson.graphql.service';
import {  Lesson } from '../../models/lesson.model';
import { MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator } from '@angular/material';

describe('lesson component', () => {
  let lessonServiceMock: Partial<LessonService>;
  let lessonTestData: Lesson[] = [];

  beforeAll(async () => {
    lessonTestData = [
         {
          _id: '1',
          title: 'Sport',
          icon: 's',
        },
        {
          _id: '2',
          title: 'Art',
          icon: 'a',
        },
      ];
      });

  beforeEach(async () => {

    lessonServiceMock = {
      getLessons: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [

      ],
      declarations: [
        LessonComponent,
        MatHeaderRow,
        MatRowDef,
        MatHeaderRowDef,
        MatSort,
        MatPaginator,
      ],
      providers: [
        LessonService,
        { provide: LessonService, useValue: lessonServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(LessonComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should load correct number of lesson ', async () => {
    (lessonServiceMock.getLessons as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(lessonTestData);
    });
    const fixture = TestBed.createComponent(LessonComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(2);
});

  it('should load zero lesson in case of promise reject', async () => {
    (lessonServiceMock.getLessons as jest.Mock).mockImplementationOnce(
      () => {return Promise.reject();
    });
    const fixture = TestBed.createComponent(LessonComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(0);

});
});
