import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LessonComponent } from './lesson.component';
import { LessonService } from '../../services/lesson/lesson.graphql.service';
import { Lesson } from '../../models/lesson.model';
import { MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator, MatDialog } from '@angular/material';

import { Observable } from 'rxjs-compat';
import { ClassService } from '../class/services/class.graphql.service';

describe('lesson component', () => {
  let lessonServiceMock: Partial<LessonService>;
  let classServiceMock: Partial<ClassService>;
  let lessonTestData: Lesson[] = [];
  let lessonDialogMock: Partial<MatDialog>;
  let lessonDialogMockValue: boolean;
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
      getAllLessons: jest.fn(),
      delete: jest.fn(),
    };
    classServiceMock = {
      getAllClasses: jest.fn().mockReturnValue(Observable.of([])),
    };
    lessonDialogMockValue = true;
    lessonDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockImplementation(() => Observable.of(lessonDialogMockValue)),
      }),
    };
    TestBed.configureTestingModule({
      imports: [],
      declarations: [LessonComponent, MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator],
      providers: [
        { provide: LessonService, useValue: lessonServiceMock },
        { provide: MatDialog, useValue: lessonDialogMock },
        { provide: ClassService, useValue: classServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(LessonComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should load correct number of lesson ', async () => {
    (lessonServiceMock.getLessons as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(lessonTestData);
    });
    (lessonServiceMock.getAllLessons as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(lessonTestData);
    });
    const fixture = TestBed.createComponent(LessonComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(2);
  });

  it('should load zero lesson in case of promise reject', async () => {
    (lessonServiceMock.getLessons as jest.Mock).mockImplementationOnce(() => {
      return Promise.reject();
    });
    const fixture = TestBed.createComponent(LessonComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(0);
  });

  it('should should open delete dialoge when calling delete component ', async () => {
    (lessonServiceMock.getLessons as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(lessonTestData);
    });
    (lessonServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const fixture = TestBed.createComponent(LessonComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteLesson('1', 'anyTitle');
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(lessonDialogMock.open).toHaveBeenCalled();
    //expect(fixture.componentInstance.dataSource.data.length).toEqual(1);
  });
  it('should call delete lesson when user confirms ', async () => {
    (lessonServiceMock.getLessons as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(lessonTestData);
    });
    (lessonServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    lessonDialogMockValue = true;
    const fixture = TestBed.createComponent(LessonComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteLesson('1', 'anyTitle');
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(lessonServiceMock.delete).toHaveBeenCalledWith('1');
  });

  it('should not call delete lesson when user cancels ', async () => {
    (lessonServiceMock.getLessons as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(lessonTestData);
    });
    (lessonServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    lessonDialogMockValue = false;

    const fixture = TestBed.createComponent(LessonComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteLesson('1', 'anyTitle');
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(lessonServiceMock.delete).not.toHaveBeenCalled();
  });
});
