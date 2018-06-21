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

describe('student component', () => {
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

    // tslint:disable-next-line:max-classes-per-file
    class StudentServiceMock {
      getAllStudents = jest.fn().mockImplementation(() => {
        const testResponse = {data: JSON.parse(testData) as StudentQuery,
          loading: false,
          networkStatus: 7 as NetworkStatus,
          stale: false} as ApolloQueryResult<StudentQuery>;
        return Promise.resolve(testResponse);
      });
      create() { console.log('create called'); }
    }

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
        { provide: StudentService, useClass: StudentServiceMock },
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

    // shallow = new Shallow(UserComponent, AppModule);
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should open dialog when calling addNewStudent function', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.addNewStudent();
    const studentDialogMock = TestBed.get(MatDialog);
    expect(studentDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling deleteStudent function', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.deleteStudent(123, 'sad', 'asd', 'אשוח');
    const studentDialogMock = TestBed.get(MatDialog);
    expect(studentDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling updateeStudent function', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.updateStudent(123, 'sad', 'asd', 'asd', 'asd', 'asd', 'asd');
    const studentDialogMock = TestBed.get(MatDialog);
    expect(studentDialogMock.open).toHaveBeenCalled();
  });
  it('should load students from service on page load ', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    const StudentServiceMock = TestBed.get(StudentService);
    expect(StudentServiceMock.getAllStudents).toHaveBeenCalled();
  });

  it('should load correct number of students ', async () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(4);
});
  it('should load correct number of students and render them in table', async () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    // console.log(fixture.nativeElement.innerHTML);
    const rows = fixture.debugElement.queryAll(By.css('.mat-table'));
    expect(rows.length).toEqual(0);
});
});
const testData = `{
  "allStudents": [
    {
      "id": "123",
      "userName": "Rotem",
      "firstName": "John1",
      "lastName": "Worg1",
      "gender": "MALE",
      "Class": {
        "name": "אגוז",
        "id": "111"
      }
    },
    {
      "id": "321",
      "userName": "John321",
      "firstName": "John2",
      "lastName": "Worg2",
      "gender": "MALE",
      "Class": {
        "name": "אגוז",
        "id": "111"
      }
    },
    {
      "id": "222",
      "userName": "John222",
      "firstName": "John3",
      "lastName": "Worg3",
      "gender": "MALE",
      "Class": {
        "name": "אשוח",
        "id": "222"
      }
    },
    {
      "id": "333",
      "userName": "John333",
      "firstName": "John4",
      "lastName": "Worg4",
      "gender": "MALE",
      "Class": {
        "name": "אשוח",
        "id": "222"
      }
    }
  ]
}`;
