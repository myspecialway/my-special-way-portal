import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  MatHeaderRowDef,
  MatRowDef,
  MatHeaderRow,
  MatDialog,
  MatSort,
  MatPaginator,
  MatPaginatorIntl,
} from '@angular/material';
import { StudentComponent } from './student.component';
import { StudentService } from './services/student.service';
import {
  Overlay,
  ScrollStrategyOptions,
  ScrollDispatcher,
  ViewportRuler,
  OverlayContainer,
  OverlayPositionBuilder,
  OverlayKeyboardDispatcher,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { studentsTestData } from '../../../mocks/assets/students.mock';
import { Observable } from 'rxjs-compat';

describe('student component', () => {
  let studentServiceMock: Partial<StudentService>;
  let studentDialogMock: Partial<MatDialog>;
  let afterClosedMockFn: jest.Mock;

  beforeEach(async () => {
    studentServiceMock = {
      getAllStudents: jest.fn().mockReturnValueOnce(Observable.of(studentsTestData.students)),
      prefetchAllStudents: jest.fn().mockReturnValueOnce(Observable.of(studentsTestData.students)),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    afterClosedMockFn = jest.fn().mockReturnValue(Observable.of(true));
    studentDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: afterClosedMockFn,
      }),
    };

    TestBed.configureTestingModule({
      imports: [],
      declarations: [StudentComponent, MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator],
      providers: [
        StudentService,
        { provide: MatDialog, useValue: studentDialogMock },
        { provide: StudentService, useValue: studentServiceMock },
        Overlay,
        ScrollStrategyOptions,
        ScrollDispatcher,
        Platform,
        ViewportRuler,
        OverlayContainer,
        OverlayPositionBuilder,
        OverlayKeyboardDispatcher,
        MatPaginatorIntl,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should open dialog when calling deleteStudent function', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.deleteStudent(123, 'sad', 'asd', 'אשוח');
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should load students from service on page load ', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    expect(studentServiceMock.getAllStudents).toHaveBeenCalled();
  });

  it('should load correct number of students ', async () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();

    expect(fixture.componentInstance.dataSource.data.length).toEqual(4);
  });

  it('should load zero students in case of promise reject', async () => {
    const getAllStudentsMock = studentServiceMock.getAllStudents as jest.Mock;
    getAllStudentsMock.mockReset();
    getAllStudentsMock.mockRejectedValueOnce(0);

    const fixture = TestBed.createComponent(StudentComponent);
    expect(fixture.componentInstance.dataSource.data.length).toEqual(0);
  });

  it('component delete should call service delete', async () => {
    (studentServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });

    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.deleteStudent(1, 'name', 'name', 'asd');

    const serviceMock = TestBed.get(StudentService);
    expect(serviceMock.delete).toHaveBeenCalled();
  });

  it(`should not do anything if user hasn't confirmed delete dialog`, () => {
    // given
    expect.hasAssertions();
    afterClosedMockFn.mockReset();
    afterClosedMockFn.mockReturnValueOnce(Observable.of(false));

    // when
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.deleteStudent(1, 'name', 'name', 'asd');

    // then
    expect(studentServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should pipe promise rejection when deleteStudent fails', async () => {
    const deleteStudentsMock = studentServiceMock.delete as jest.Mock;
    deleteStudentsMock.mockReset();
    deleteStudentsMock.mockReturnValueOnce(Promise.reject('oh no!'));

    const fixture = TestBed.createComponent(StudentComponent).componentInstance;

    expect(fixture.deleteStudent(1, 'a', 'a', 'a')).rejects.toEqual('oh no!');
  });

  xit('should display an error to the user when deleteStudent fails', () => {});
});
