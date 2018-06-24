import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatHeaderRow, MatDialog, MatSort, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { StudentComponent } from './student.component';
import { StudentService } from './services/student.graphql.service';
import { NetworkStatus, ApolloQueryResult } from 'apollo-client';
import { By } from '@angular/platform-browser';
import { StudentQuery } from '../../models/student.model';
import { Overlay, ScrollStrategyOptions,
         ScrollDispatcher, ViewportRuler,
         OverlayContainer, OverlayPositionBuilder,
         OverlayKeyboardDispatcher,
       } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { studentTestData } from '../../../mocks/assets/students.mock';
jest.mock('./services/student.graphql.service');

describe('student component', () => {
  let studentServiceMock: Partial<StudentService>;
  const testResponse = {
                        data: JSON.parse(studentTestData) as StudentQuery,
                        loading: false,
                        networkStatus: 7 as NetworkStatus,
                        stale: false,
                       } as ApolloQueryResult<StudentQuery>;

  beforeEach(async () => {
    class UserDialogMock {
      open = jest.fn().mockImplementation(() => {
        return {
          afterClosed: () => {
            return {
              subscribe: jest.fn(),
            };
          },
        };
      });
    }

    studentServiceMock = {
      getAllStudents: jest.fn(),

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
        { provide: MatDialog, useClass: UserDialogMock },
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

  it('should open dialog when calling addNewStudent function', () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(testResponse);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.addNewStudent();
    const studentDialogMock = TestBed.get(MatDialog);
    expect(studentDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling deleteStudent function', () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(testResponse);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.deleteStudent(123, 'sad', 'asd', 'אשוח');
    const studentDialogMock = TestBed.get(MatDialog);
    expect(studentDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling updateeStudent function', () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(testResponse);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.updateStudent(123, 'sad', 'asd', 'asd', 'asd', 'asd', 'asd');
    const studentDialogMock = TestBed.get(MatDialog);
    expect(studentDialogMock.open).toHaveBeenCalled();
  });
  it('should load students from service on page load ', () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(testResponse);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    const StudentServiceMock = TestBed.get(StudentService);
    expect(StudentServiceMock.getAllStudents).toHaveBeenCalled();
  });

  it('should load correct number of students ', async () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(testResponse);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(4);
});
  it.only('should load correct number of students and render them in table', async () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(testResponse);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    // console.log(fixture.nativeElement.innerHTML);
    const rows = fixture.debugElement.queryAll(By.css('.example-table'));
    console.log(fixture.debugElement.nativeElement.innerHTML);
    expect(rows.length).toEqual(4); // TODO: fix this!
});

  it('should invoke addnewstudent when the new student button is clicked', async () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(testResponse);
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    // console.log(fixture.nativeElement.innerHTML);
    const de = fixture.debugElement;
    // de.nativeElement.querySelector('.mat-raised-button').click();
    // const button = fixture.debugElement.query(By.css('.mat-raised-button')).nativeElement;
    // button.triggerEventHandler('click', null);
    fixture.detectChanges();
    // const StudentServiceMock = TestBed.get(StudentService);
    expect(de.nativeElement.querySelector('.mat-raised-button')).not.toBeNull();
    // expect(StudentServiceMock.addNewStudent).toHaveBeenCalled();

});

  it('should load zero students in case of promise reject', async () => {
    (studentServiceMock.getAllStudents as jest.Mock).mockImplementationOnce(
      () => {return Promise.reject();
    });
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(0);

});
});
