import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatHeaderRow, MatDialog, MatSort } from '@angular/material';
import { StudentDetailsComponent } from './student-details.component';
import { StudentService } from '../services/student.graphql.service';
import { Overlay, ScrollStrategyOptions,
  ScrollDispatcher, ViewportRuler,
  OverlayContainer, OverlayPositionBuilder,
  OverlayKeyboardDispatcher,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { classTestData } from '../../../../mocks/assets/classes.mock';
import { Observable } from 'rxjs-compat';
import {FormsModule} from '@angular/forms';
import {ClassService} from '../../class/services/class.graphql.service';
import {ActivatedRoute, Router, RouterModule, Routes} from '@angular/router';
import {oneStudentTestData} from '../../../../mocks/assets/student.mock';

describe('Student Details Component', () => {
  let studentServiceMock: Partial<StudentService>;
  let classServiceMock: Partial<ClassService>;
  let activatedRouteMock;
  let studentDialogMock: Partial<MatDialog>;
  let routerModuleMock: Partial<RouterModule>;

  beforeEach(async () => {

    studentServiceMock = {
      getAllStudents: jest.fn(),
      getById: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    routerModuleMock = {
      forRoot: jest.fn(),
      forChild: jest.fn(),
      navigate: jest.fn(),
    };

    classServiceMock = {
      getAllClasses: jest.fn(),
    };

    studentDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(true)),
      }),
    };

    const routes: Routes = [
      { path: '', redirectTo: 'student', pathMatch: 'full' },
      { path: 'student/_new_', component: StudentDetailsComponent},
      { path: 'student/:id', component: StudentDetailsComponent},
    ];

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterModule.forRoot(routes),
      ],
      declarations: [
        StudentDetailsComponent,
        MatHeaderRow,
        MatRowDef,
        MatHeaderRowDef,
        MatSort,
      ],
      providers: [
        StudentService,
        ClassService,
        { provide: MatDialog, useValue: studentDialogMock },
        { provide: StudentService, useValue: studentServiceMock },
        { provide: ClassService, useValue: classServiceMock },
        { provide: Router, useValue: routerModuleMock },
        Overlay,
        ScrollStrategyOptions,
        ScrollDispatcher,
        Platform,
        ViewportRuler,
        OverlayContainer,
        OverlayPositionBuilder,
        OverlayKeyboardDispatcher,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

  });

  describe('with _new_ student path', () => {
    beforeEach(async () => {
      activatedRouteMock = {
        snapshot: {
          routeConfig: {
            path: 'student/_new_',
          },
        },
      };

      TestBed.configureTestingModule({
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          ],
      });
    });

    it('should render the component as described in snapshot', () => {
      const fixture = TestBed.createComponent(StudentDetailsComponent);
      expect(fixture).toMatchSnapshot();
    });

    it('should load classes from service on page load ', async () => {
      (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(
        () => {return Promise.resolve(classTestData.classes);
        });

      const fixture = TestBed.createComponent(StudentDetailsComponent);
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      expect(fixture.componentInstance.classes.length).toEqual(23);
    });

    it('should populate the isNewStudent to true when coming from path student/_new_', () => {
      (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(
        () => {return Promise.resolve(classTestData.classes);
        });

      const fixture = TestBed.createComponent(StudentDetailsComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.isNewStudent).toBe(true);
    });

    it('should call the create function on create student', async () => {
      (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(
        () => {return Promise.resolve(classTestData.classes);
        });

      (studentServiceMock.create as jest.Mock).mockImplementationOnce(
        () => {return Promise.resolve(1);
        });

      const fixture = TestBed.createComponent(StudentDetailsComponent);
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      fixture.componentInstance.addStudent();
      expect(studentServiceMock.create).toHaveBeenCalled();
    });
  });

  describe('with edit student path', () => {
    beforeEach(async () => {
      activatedRouteMock = {
        snapshot: {
          routeConfig: {
            path: 'student/:id',
          },
        },
        params: {
          value: {
            id: '66',
          },
        },
      };

      TestBed.configureTestingModule({
        providers: [
          {provide: ActivatedRoute, useValue: activatedRouteMock},
        ],
      });
    });

    it('should load the student details from service on page load ', async () => {
      (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(
        () => {return Promise.resolve(classTestData.classes);
        });

      (studentServiceMock.getById as jest.Mock).mockImplementationOnce(
        () => {
          return Promise.resolve(oneStudentTestData.student);
        });

      const fixture = TestBed.createComponent(StudentDetailsComponent);
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      expect(fixture.componentInstance.student.firstname).toEqual('John1');
    });

    it('should populate the isNewStudent to false when coming from path student/:id', () => {
      (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(
        () => {return Promise.resolve(classTestData.classes);
        });

      (studentServiceMock.getById as jest.Mock).mockImplementationOnce(
        () => {return Promise.resolve(oneStudentTestData.student);
        });

      const fixture = TestBed.createComponent(StudentDetailsComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.isNewStudent).toBe(false);
    });

    it('should call the update function on update student', async () => {
      (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(
        () => {return Promise.resolve(classTestData.classes);
        });

      (studentServiceMock.getById as jest.Mock).mockImplementationOnce(
        () => {return Promise.resolve(oneStudentTestData.student);
        });

      (studentServiceMock.update as jest.Mock).mockImplementationOnce(
        () => {return Promise.resolve(1);
        });

      const fixture = TestBed.createComponent(StudentDetailsComponent);
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      fixture.componentInstance.updateStudent({form: { value: { _id: '66'}}});
      expect(studentServiceMock.update).toHaveBeenCalled();
    });

  });
});
