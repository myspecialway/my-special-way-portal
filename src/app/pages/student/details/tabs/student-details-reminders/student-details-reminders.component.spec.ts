import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs-compat';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentDetailsRemindersComponent } from './student-details-reminders.component';
import { StudentDetailsComponent } from '../../student-details.component';
import { MatDialog } from '@angular/material';
import { StudentService } from '../../../services/student.service';
let studentReminderDialogMock: Partial<MatDialog>;

describe('Student Details Reminders Component', () => {
  let studentServiceMock: Partial<StudentService>;

  beforeEach(async () => {
    studentReminderDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(true)),
      }),
    };

    studentServiceMock = {
      // getById: jest.fn().mockReturnValue(Promise.resolve({})),
      update: jest.fn(),
      getById: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [StudentDetailsComponent, StudentDetailsRemindersComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            forRoot: jest.fn(),
          },
        },
        Platform,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: Observable.of({ idOrNew: '_new_' }),
            },
          },
        },
        { provide: StudentService, useValue: studentServiceMock },
        { provide: MatDialog, useValue: studentReminderDialogMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  describe('with _new_ student path', () => {
    beforeEach(async () => {});

    it('should render the component as described in snapshot', () => {
      const fixture = TestBed.createComponent(StudentDetailsRemindersComponent);
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });

    it('should subscribe to params onInit', () => {
      const activatedRouteMock = {
        parent: {
          params: {
            subscribe: jest.fn().mockImplementationOnce((callback) => callback({})),
          },
        },
      } as never;
      const studentReminderDialogInitMock = {
        parent: {
          params: {
            subscribe: jest.fn().mockImplementationOnce((callback) => callback({})),
          },
        },
      } as never;
      const studentDetailsReminder = new StudentDetailsRemindersComponent(
        activatedRouteMock,
        studentReminderDialogInitMock,
      );

      // when
      studentDetailsReminder.ngOnInit();

      // then
      // tslint:disable-next-line:no-non-null-assertion test case only
      const subscribeMock = (activatedRouteMock as ActivatedRoute).parent!.params.subscribe as jest.Mock;
      expect(subscribeMock).toHaveBeenCalled();
    });
  });
});
