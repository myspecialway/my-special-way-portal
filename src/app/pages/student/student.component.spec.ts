import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatHeaderRow, MatDialog,
        MatSort, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { StudentComponent } from './student.component';
import { StudentService } from './services/student.graphql.service';
import { NetworkStatus, ApolloQueryResult } from 'apollo-client';
import { StudentQuery } from '../../models/student.model';
import { Overlay, ScrollStrategyOptions,
         ScrollDispatcher, ViewportRuler,
         OverlayContainer, OverlayPositionBuilder,
         OverlayKeyboardDispatcher,
       } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { studentsTestData } from '../../../mocks/assets/students.mock';
import { Observable } from 'rxjs-compat';

describe('student component', () => {
  let studentServiceMock: Partial<StudentService>;
  let studentDialogMock: Partial<MatDialog>;

  beforeEach(async () => {

    studentServiceMock = {
      getAllStudents: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    studentDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(true)),
      }),
    };

    TestBed.configureTestingModule({
      imports: [

      ],
      declarations: [
        StudentComponent,
        MatHeaderRow,
        MatRowDef,
        MatHeaderRowDef,
        MatSort,
        MatPaginator,

      ],
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
    (studentServiceMock.delete as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(1);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.deleteStudent(123, 'sad', 'asd', 'אשוח');
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should load students from service on page load ', () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(studentsTestData.students);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    const DialogMock = TestBed.get(StudentService);
    expect(DialogMock.getAllStudents).toHaveBeenCalled();
  });

  it('should load correct number of students ', async () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(studentsTestData.students);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(4);
});

  it('should load zero students in case of promise reject', async () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.reject(0);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(0);
});

  it('component delete should call service delete', async () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(studentsTestData.students);
      });

    (studentServiceMock.delete as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(1);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.componentInstance.deleteStudent(1, 'name', 'name', 'asd');
    const serviceMock = TestBed.get(StudentService);
    expect(serviceMock.delete).toHaveBeenCalled();
  });

});
