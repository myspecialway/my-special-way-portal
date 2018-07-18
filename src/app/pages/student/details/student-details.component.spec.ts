import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatHeaderRow, MatDialog,
  MatSort, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { StudentDetailsComponent } from './student-details.component';
import { StudentService } from '../services/student.graphql.service';
import { NetworkStatus, ApolloQueryResult } from 'apollo-client';
import { StudentQuery } from '../../../models/student.model';
import { Overlay, ScrollStrategyOptions,
  ScrollDispatcher, ViewportRuler,
  OverlayContainer, OverlayPositionBuilder,
  OverlayKeyboardDispatcher,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { studentTestData } from '../../../../mocks/assets/students.mock';
import { Observable } from 'rxjs-compat';

describe('Student Details Component', () => {
  let studentServiceMock: Partial<StudentService>;
  let studentDialogMock: Partial<MatDialog>;
  const testResponse = {
    data: JSON.parse(studentTestData) as StudentQuery,
    loading: false,
    networkStatus: 7 as NetworkStatus,
    stale: false,
  } as ApolloQueryResult<StudentQuery>;

  beforeEach(async () => {

    studentServiceMock = {
      getAllStudents: jest.fn(),
      getById: jest.fn(),
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
        StudentDetailsComponent,
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

  it('should render the component as described in snapshot', () => {
    const fixture = TestBed.createComponent(StudentDetailsComponent);
    expect(fixture).toMatchSnapshot();
  });

  // it('should load the student details from service on page load ', () => {
  //   (studentServiceMock.getById as jest.Mock).mockImplementationOnce(
  //     () => {return Promise.resolve(testResponse);
  //     });
  //   const fixture = TestBed.createComponent(StudentDetailsComponent);
  //   fixture.detectChanges();
  //   expect(studentServiceMock.getById).toHaveBeenCalled();
  // });

  // it('should load the classes from service on page load ', () => {
  //   (studentServiceMock.getById as jest.Mock).mockImplementationOnce(
  //     () => {return Promise.resolve(testResponse);
  //     });
  //   const fixture = TestBed.createComponent(StudentDetailsComponent);
  //   fixture.detectChanges();
  //   expect(studentServiceMock.getById).toHaveBeenCalled();
  // });
  //
  // it('should load correct number of students ', async () => {
  //   (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
  //     () => {return Promise.resolve(testResponse);
  //     });
  //   const fixture = TestBed.createComponent(StudentComponent);
  //   fixture.detectChanges();
  //   await fixture.whenRenderingDone();
  //   expect(fixture.componentInstance.dataSource.data.length).toEqual(4);
  // });
  //
  // it('should load zero students in case of promise reject', async () => {
  //   (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
  //     () => {return Promise.reject();
  //     });
  //   const fixture = TestBed.createComponent(StudentComponent);
  //   fixture.detectChanges();
  //   await fixture.whenRenderingDone();
  //   expect(fixture.componentInstance.dataSource.data.length).toEqual(0);
  //
  // });
  // it('component delete should call service delete', async () => {
  //   (studentServiceMock.delete as jest.Mock).mockImplementationOnce(
  //     () => {return Promise.resolve(1);
  //     });
  //   const fixture = TestBed.createComponent(StudentComponent);
  //   fixture.detectChanges();
  //   await fixture.whenRenderingDone();
  //   fixture.componentInstance.deleteStudent(1, 'name', 'name', 'asd');
  //   const serviceMock = TestBed.get(StudentService);
  //   expect(serviceMock.delete).toHaveBeenCalled();
  // });

});
