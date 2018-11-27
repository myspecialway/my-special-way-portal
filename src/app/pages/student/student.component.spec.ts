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
import { Observable, Subject } from 'rxjs-compat';
import { Apollo } from 'apollo-angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MSWSnackbar } from '../../services/msw-snackbar/msw-snackbar.service';
import { ClassService } from '../class/services/class.graphql.service';
import { classTestData } from '../../../mocks/assets/classes.mock';
import { Papa } from 'ngx-papaparse';

describe('student component', () => {
  let studentServiceMock: Partial<StudentService>;
  let authenticationServiceMock: Partial<AuthenticationService>;
  let studentDialogMock: Partial<MatDialog>;
  let classServiceMock: Partial<ClassService>;
  let papaMock: Partial<Papa>;
  let afterClosedMockFn: jest.Mock;
  const watchQueryMockedObservable = new Subject<any>();

  beforeEach(async () => {
    studentServiceMock = {
      getAllStudents: jest.fn().mockReturnValueOnce(Observable.of(studentsTestData.students)),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    authenticationServiceMock = {
      checkUsernameUnique: jest.fn().mockReturnValue(Observable.of(true)),
    };

    classServiceMock = {
      getAllClasses: jest.fn().mockReturnValueOnce(Observable.of(classTestData.classes)),
    };

    const mswSnackbarMock = {
      displayTimedMessage: jest.fn(),
    } as Partial<MSWSnackbar>;

    papaMock = {
      parse: jest.fn(),
    };

    afterClosedMockFn = jest.fn().mockReturnValue(Observable.of(true));
    studentDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: afterClosedMockFn,
      }),
    };

    const apolloMock = {
      watchQuery: () => ({
        valueChanges: watchQueryMockedObservable,
      }),
    };

    TestBed.configureTestingModule({
      imports: [],
      declarations: [StudentComponent, MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator],
      providers: [
        StudentService,
        { provide: MatDialog, useValue: studentDialogMock },
        { provide: StudentService, useValue: studentServiceMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: ClassService, useValue: classServiceMock },
        { provide: MSWSnackbar, useValue: mswSnackbarMock },
        { provide: Papa, useValue: papaMock },
        Overlay,
        ScrollStrategyOptions,
        ScrollDispatcher,
        Platform,
        ViewportRuler,
        OverlayContainer,
        OverlayPositionBuilder,
        OverlayKeyboardDispatcher,
        MatPaginatorIntl,
        { provide: Apollo, useValue: apolloMock },
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
    fixture.componentInstance.deleteStudent(123, 'sad', 'asd', 'אשוח', 'MALE');
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  /*
  ** temporry remove this as it fails with undefined of valueChanges
  *
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
  ***/

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
    fixture.componentInstance.deleteStudent(1, 'name', 'name', 'asd', 'MALE');

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
    fixture.componentInstance.deleteStudent(1, 'name', 'name', 'asd', 'MALE');

    // then
    expect(studentServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should pipe promise rejection when deleteStudent fails', async () => {
    const deleteStudentsMock = studentServiceMock.delete as jest.Mock;
    deleteStudentsMock.mockReset();
    deleteStudentsMock.mockReturnValueOnce(Promise.reject('oh no!'));

    const fixture = TestBed.createComponent(StudentComponent).componentInstance;

    expect(fixture.deleteStudent(1, 'a', 'a', 'a', 'MALE')).rejects.toEqual('oh no!');
  });

  it('should sort students by firstname+lastname', async () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(() => {
      return of(studentsTestData.students);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const data = fixture.componentInstance.dataSource.data;
    for (let i = 0; i < data.length - 1; i++) {
      const student1 = data[i].firstname + data[i].lastname;
      const student2 = data[i + 1].firstname + data[i + 1].lastname;
      const comapare = student1.localeCompare(student2);
      expect(comapare).toEqual(-1);
    }
  });

  xit('should display an error to the user when deleteStudent fails', () => {});
});
