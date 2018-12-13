import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator, MatDialog } from '@angular/material';

import { Observable } from 'rxjs-compat';
import { ClassService } from '../class/services/class.graphql.service';
import { NonActiveTimeService } from '../../services/non-active-time/non-active-time.graphql.service';
import { NonActiveTime } from '../../models/non-active-time.model';
import { NonActiveTimeComponent } from './non-active-time.component';

describe('lesson component', () => {
  let nonActiveTimeServiceMock: Partial<NonActiveTimeService>;
  let classServiceMock: Partial<ClassService>;
  let nonActiveTimeTestData: NonActiveTime[] = [];

  let nonActiveTimeDialogueMock: Partial<MatDialog>;
  let nonActiveTimeDialogueMockValue: boolean;

  beforeAll(async () => {
    nonActiveTimeTestData = [
      {
        _id: '5c0fa61642d6052794ab44c8',
        title: 'best title ever',
        isAllDayEvent: false,
        startDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
        endDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
        isAllClassesEvent: false,
        classes: [
          {
            _id: '5c04f3814408e8334404ef16',
            name: 'טיטאן',
          },
          {
            _id: '5c04f3814408e8334404ef17',
            name: 'פטל',
          },
        ],
      },
      {
        _id: '5c0fbbb04e773c17106afdb0',
        title: 'best title ever 2222222',
        isAllDayEvent: false,
        startDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
        endDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
        isAllClassesEvent: false,
        classes: [
          {
            _id: '5c04f3814408e8334404ef17',
            name: 'פטל',
          },
        ],
      },
    ];
  });

  beforeEach(async () => {
    nonActiveTimeServiceMock = {
      getAllNonActiveTimes: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    classServiceMock = {
      getAllClasses: jest.fn().mockImplementation(() => Observable.of([])),
    };
    nonActiveTimeDialogueMockValue = true;
    nonActiveTimeDialogueMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockImplementation(() => Observable.of(nonActiveTimeDialogueMockValue)),
      }),
    };

    TestBed.configureTestingModule({
      imports: [],
      declarations: [NonActiveTimeComponent, MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator],
      providers: [
        { provide: NonActiveTimeService, useValue: nonActiveTimeServiceMock },
        { provide: MatDialog, useValue: nonActiveTimeDialogueMock },
        { provide: ClassService, useValue: classServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should load correct number of Non active times ', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(nonActiveTimeTestData);
    });
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(2);
  });

  it('should load zero Non active times in case of promise reject', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Promise.reject();
    });
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(0);
  });

  it('should open delete delete component dialogue', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(nonActiveTimeTestData);
    });
    (nonActiveTimeServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(nonActiveTimeDialogueMock.open).toHaveBeenCalled();
  });
  it('should call deleteNonActiveTime when user confirms ', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(nonActiveTimeTestData);
    });
    (nonActiveTimeServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    nonActiveTimeDialogueMockValue = true;
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(nonActiveTimeServiceMock.delete).toHaveBeenCalledWith(nonActiveTimeTestData[0]._id);
  });

  it('should not call deleteNonActiveTime when user cancels ', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(nonActiveTimeTestData);
    });
    (nonActiveTimeServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    nonActiveTimeDialogueMockValue = false;

    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(nonActiveTimeServiceMock.delete).not.toHaveBeenCalled();
  });

  // add-edit tests
  /*it('should call lesson update when user edits a lesson', async () => {
    const anyLesson: Lesson = {
      _id: 'anyId',
      title: 'sometitle',
      icon: 'an-icon',
    };

    (lessonServiceMock.getLessons as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(lessonTestData);
    });
    (lessonServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });

    const fixture = TestBed.createComponent(LessonComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.componentInstance.editLesson(anyLesson);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(lessonServiceMock.update).toHaveBeenCalled();
  });
  it('should call lesson create when calling add new lesson ', async () => {
    (lessonServiceMock.getLessons as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(lessonTestData);
    });
    (lessonServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });

    const fixture = TestBed.createComponent(LessonComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.componentInstance.addNewLesson();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(lessonServiceMock.create).toHaveBeenCalled();
  });
  it('should not call lesson create or update when dialog resilt is false ', async () => {
    (lessonServiceMock.getLessons as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(lessonTestData);
    });
    (lessonServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    lessonDialogMockValue = false;
    const fixture = TestBed.createComponent(LessonComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.componentInstance.addNewLesson();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(lessonServiceMock.create).not.toHaveBeenCalled();
    expect(lessonServiceMock.update).not.toHaveBeenCalled();
  });*/
});
