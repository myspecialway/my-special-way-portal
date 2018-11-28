import { TestBed, fakeAsync } from '@angular/core/testing';
import {
  MatDialog,
  MatSort,
  MatPaginator,
  MatPaginatorIntl,
  MatTableModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule,
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
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MSWSnackbar } from '../../services/msw-snackbar/msw-snackbar.service';
import { ClassService } from '../class/services/class.graphql.service';
import { classTestData } from '../../../mocks/assets/classes.mock';
import { Papa } from 'ngx-papaparse';
import {
  studentsValidCsvParseResultTestData,
  studentsInvalidCsvParseResultTestData,
  studentsInvalidCsvErrorsExpectation,
} from '../../../mocks/assets/students.csv.mock';

describe('student component', () => {
  let studentServiceMock: Partial<StudentService>;
  let authenticationServiceMock: Partial<AuthenticationService>;
  let studentDialogMock: Partial<MatDialog>;
  let classServiceMock: Partial<ClassService>;
  let mswSnackbarMock: Partial<MSWSnackbar>;
  let papaMock: Partial<Papa>;
  let afterClosedMockFn: jest.Mock;
  const watchQueryMockedObservable = new Subject<any>();

  beforeEach(async () => {
    studentServiceMock = {
      getAllStudents: jest.fn().mockReturnValueOnce(Observable.of(studentsTestData.students)),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      createMany: jest.fn().mockImplementation(() => Promise.resolve()),
    };

    authenticationServiceMock = {
      checkUsernameUnique: jest.fn().mockReturnValue(Observable.of(true)),
    };

    classServiceMock = {
      getAllClasses: jest.fn().mockReturnValue(Observable.of(classTestData.classes)),
    };

    mswSnackbarMock = {
      displayTimedMessage: jest.fn(),
    };

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
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MatTooltipModule,
        MatSelectModule,
        MatTableModule,
        MatIconModule,
        CdkTableModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [StudentComponent, MatSort, MatPaginator],
      providers: [
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

  it('should not show no records massage if there is data', fakeAsync(() => {
    // given
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();

    // then
    expect(fixture.componentInstance.showNoRecords).toBe(false);
  }));

  it('should show no records massage if there is no data', fakeAsync(() => {
    // given
    studentServiceMock.getAllStudents = jest.fn().mockReturnValueOnce(Observable.of([]));
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.detectChanges();

    // then
    expect(fixture.componentInstance.showNoRecords).toBe(true);
  }));

  describe('filter table', () => {
    describe('filter by student name', () => {
      it('should hide filter by default', () => {
        const fixture = TestBed.createComponent(StudentComponent);
        expect(fixture.componentInstance.showStudentNameFilter).toBe(false);
      });

      it('should show filter name input after call to to toggleStudentNameFilter', () => {
        const fixture = TestBed.createComponent(StudentComponent);
        fixture.componentInstance.toggleStudentNameFilter();
        expect(fixture.componentInstance.showStudentNameFilter).toBe(true);
      });

      it('should show filter name input in any case, if there is filter applyed', () => {
        const fixture = TestBed.createComponent(StudentComponent);
        fixture.componentInstance.toggleStudentNameFilter();
        fixture.componentInstance.studentNameFilter.setValue('some text');
        fixture.componentInstance.toggleStudentNameFilter();
        expect(fixture.componentInstance.showStudentNameFilter).toBe(true);
        fixture.componentInstance.toggleStudentNameFilter();
        expect(fixture.componentInstance.showStudentNameFilter).toBe(true);
      });

      it('should show no records massage if the studentName filter has no macth', fakeAsync(() => {
        // given
        const fixture = TestBed.createComponent(StudentComponent);
        fixture.detectChanges();

        // when
        const component = fixture.componentInstance;
        component.showNoRecords = false;
        component.dataSource.filteredData = [];
        fixture.debugElement.query(By.css('.mat-column-studentName mat-icon')).nativeElement.click();
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('.mat-column-studentName input'));
        input.triggerEventHandler('input', { target: { value: 'no such student' } });
        fixture.detectChanges();

        // then
        expect(fixture.componentInstance.showNoRecords).toBe(true);
      }));
    });

    describe('filter by class name', () => {
      it('should hide filter by default', () => {
        const fixture = TestBed.createComponent(StudentComponent);
        expect(fixture.componentInstance.showGradeIdFilter).toBe(false);
      });

      it("should show filter's gradeId input after call to to toggleGradeIdFilter", () => {
        const fixture = TestBed.createComponent(StudentComponent);
        fixture.componentInstance.toggleGradeIdFilter();
        expect(fixture.componentInstance.showGradeIdFilter).toBe(true);
      });

      it("should show filter's gradeId input in any case, if there is filter applyed", () => {
        const fixture = TestBed.createComponent(StudentComponent);
        fixture.componentInstance.toggleGradeIdFilter();
        fixture.componentInstance.gradeIdFilter.setValue('some text');
        fixture.componentInstance.toggleGradeIdFilter();
        expect(fixture.componentInstance.showGradeIdFilter).toBe(true);
        fixture.componentInstance.toggleGradeIdFilter();
        expect(fixture.componentInstance.showGradeIdFilter).toBe(true);
      });

      it('should show no records massage if the gradeId filter has no match', fakeAsync(() => {
        // given
        const fixture = TestBed.createComponent(StudentComponent);
        fixture.detectChanges();

        // when
        const component = fixture.componentInstance;
        component.showNoRecords = false;
        component.dataSource.filteredData = [];
        fixture.debugElement.query(By.css('.mat-column-gradeId mat-icon')).nativeElement.click();
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('.mat-column-gradeId input'));
        input.triggerEventHandler('input', { target: { value: 'no such gradeId' } });
        fixture.detectChanges();

        // then
        expect(fixture.componentInstance.showNoRecords).toBe(true);
      }));
    });
  });

  describe('import students from file', () => {
    it('should call to the csv parser for a given file ', () => {
      //given
      const fixture = TestBed.createComponent(StudentComponent);
      //when
      fixture.componentInstance.onFileChange({ target: { files: ['/path/to/file.csv'] } });
      //then
      expect(papaMock.parse).toBeCalled();
    });

    it('should add all the students from csv file', (done) => {
      papaMock.parse = jest.fn().mockImplementationOnce((_, options) => {
        options.complete(studentsValidCsvParseResultTestData);
      });
      studentServiceMock.createMany = jest.fn().mockImplementationOnce((students) => {
        //then
        expect(students.length).toBe(studentsValidCsvParseResultTestData.data.length);
        done();
      });

      //given
      const fixture = TestBed.createComponent(StudentComponent);
      fixture.detectChanges();

      //when
      fixture.componentInstance.onFileChange({ target: { files: ['/path/to/file.csv'] } });
    });

    it('should show snackbar on sucsess', (done) => {
      papaMock.parse = jest.fn().mockImplementationOnce((_, options) => {
        options.complete(studentsValidCsvParseResultTestData);
      });
      mswSnackbarMock.displayTimedMessage = jest.fn().mockImplementationOnce((message) => {
        //then
        expect(message).toBe('קובץ נטען בהצלחה');
        done();
      });

      //given
      const fixture = TestBed.createComponent(StudentComponent);
      fixture.detectChanges();

      //when
      fixture.componentInstance.onFileChange({ target: { files: ['/path/to/file.csv'] } });
    });

    it('should rise error dialog with all the format errors', (done) => {
      papaMock.parse = jest.fn().mockImplementationOnce((_, options) => {
        options.complete(studentsInvalidCsvParseResultTestData);
      });

      studentDialogMock.open = jest.fn().mockImplementationOnce((component, error) => {
        //then
        expect(component).toEqual(ErrorDialogComponent);
        expect(error).toEqual(studentsInvalidCsvErrorsExpectation);
        done();
      });

      //given
      const fixture = TestBed.createComponent(StudentComponent);
      fixture.detectChanges();

      //when
      fixture.componentInstance.onFileChange({ target: { files: ['/path/to/file.csv'] } });
    });

    it('should rise error dialog on connection failure', (done) => {
      papaMock.parse = jest.fn().mockImplementationOnce((_, options) => {
        options.complete(studentsValidCsvParseResultTestData);
      });

      studentServiceMock.createMany = jest.fn().mockImplementationOnce(() => {
        throw new Error('Mock Error');
      });

      studentDialogMock.open = jest.fn().mockImplementationOnce((component, error) => {
        //then
        expect(component).toEqual(ErrorDialogComponent);
        expect(error.data.title).toBe('שגיאה בטעינת הקובץ');
        done();
      });

      //given
      const fixture = TestBed.createComponent(StudentComponent);
      fixture.detectChanges();

      //when
      fixture.componentInstance.onFileChange({ target: { files: ['/path/to/file.csv'] } });
    });
  });
});
