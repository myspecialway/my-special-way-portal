import { Gender, StudentQuery } from './../../../../../models/student.model';
import { AddStudentReminderDialogComponent } from './../../../dialogs/reminders/add/add-student-reminder.dialog';
import { IReminder } from './../../../../../models/reminder.model';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable, Subject } from 'rxjs-compat';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentDetailsRemindersComponent } from './student-details-reminders.component';
import { StudentDetailsComponent } from '../../student-details.component';
import { MatDialog } from '@angular/material';
import { StudentService } from '../../../services/student.service';
import { IDbReminderTime } from '../../../../../models/reminder-time.model';
import Student from '../../../../../models/student.model';
import { Class } from '../../../../../models/class.model';

describe('Student Details Reminders Component', () => {
  let studentServiceMock: Partial<StudentService>;
  let fixture: ComponentFixture<StudentDetailsRemindersComponent>;
  let component: StudentDetailsRemindersComponent;
  let activatedRouteMock: Partial<ActivatedRoute>;
  let paramsMock;
  let studentReminderDialogMock: Partial<MatDialog>;
  let observableAfterClosed: Subject<IReminder>;
  let afterClosedMockFn: jest.Mock;
  let studentMock: Student;

  beforeEach(setup);

  // describe('with _new_ student path', () => {

  it('should render the component as described in snapshot', () => {
    setComponent();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should subscribe to params onInit', () => {
    // given

    setComponent();

    // when
    component.ngOnInit();

    // then
    // tslint:disable-next-line:no-non-null-assertion test case only
    expect(activatedRouteMock.parent!.params.subscribe).toHaveBeenCalled();
  });

  it('should call get student-by-id on params subscription', () => {
    // given
    // tslint:disable-next-line:no-non-null-assertion
    activatedRouteMock.parent!.params = Observable.of({ idOrNew: '' });
    setComponent();

    // when
    component.ngOnInit();

    // then
    expect(studentServiceMock.getById).toHaveBeenCalled();
  });

  it('should call get student-by-id with params id on params subscription', () => {
    // given
    setComponent();

    // when
    component.ngOnInit();

    // then
    expect(studentServiceMock.getById).toBeCalledWith(paramsMock.idOrNew);
  });

  it('should get sorted selected days names string from getSelectedDays', () => {
    setComponent();

    // given
    const unsortedDays = { daysindex: [3, 1, 4] } as IDbReminderTime;
    const expected = [component.dayNames[1], component.dayNames[3], component.dayNames[4]].join(',');

    expect(component.getSelectedDays(unsortedDays)).toEqual(expected);
  });

  it('should get empty string from getSelectedDays on empty slot', () => {
    setComponent();

    // given
    const unsortedDays = ({ daysindex: [] } as any) as IDbReminderTime;
    const expected = '';

    expect(component.getSelectedDays(unsortedDays)).toEqual(expected);
  });

  it('should get sorted selected hours names string from getSelectedDays', () => {
    setComponent();

    // given
    const unsortedHours = { hours: ['10:00', '07:30', '13:00'] } as IDbReminderTime;
    const expected = [['07:30', '10:00', '13:00']].join(',');

    expect(component.getSelectedHours(unsortedHours)).toEqual(expected);
  });

  it('should open reminder dialog popup when updateStudentReminder', () => {
    // given
    const dialogData = {} as IReminder;
    setComponent();
    fixture.detectChanges();

    // when
    component.updateStudentReminder(dialogData);

    // then
    expect(studentReminderDialogMock.open).toBeCalled();
  });

  it('should open reminder dialog popup with valid params when updateStudentReminder', () => {
    // given
    const dialogData = {} as IReminder;
    setComponent();
    component.fetchStudent = jest.fn();
    fixture.detectChanges();
    const expected = {
      data: dialogData,
      height: '376px',
      width: '631px',
    };
    component.onDialogClose = jest.fn();

    // when
    component.updateStudentReminder(dialogData);

    // then
    expect(studentReminderDialogMock.open).toBeCalledWith(AddStudentReminderDialogComponent, expected);
  });

  it('should call onDialogClose on dialog afterclosed', async () => {
    // given
    const dialogData = {} as IReminder;
    setComponent();
    component.fetchStudent = jest.fn();
    fixture.detectChanges();

    component.onDialogClose = jest.fn();

    // when
    component.updateStudentReminder(dialogData);
    observableAfterClosed.next(dialogData);

    expect(component.onDialogClose).toBeCalledWith(dialogData);
  });

  it('should call studentService.update on onDialogClose', async () => {
    // given
    const reminder = {
      ...studentMock.reminders[0],
    };
    setComponent();
    fixture.detectChanges();

    component.student = { ...studentMock };

    await component.onDialogClose(reminder);
    expect(studentServiceMock.update).toBeCalled();
  });

  it('should fetchStudent when studentService.update was successful when onDialogClose', async () => {
    // given
    const reminder = {
      ...studentMock.reminders[0],
    };
    setComponent();
    fixture.detectChanges();

    component.student = { ...studentMock };
    component.fetchStudent = jest.fn().mockImplementationOnce(() => {});

    // when
    await component.onDialogClose(reminder);

    // then
    expect(studentServiceMock.update).toBeCalled();
    const res = await (studentServiceMock.update as jest.Mock)({} as StudentQuery);
    expect(res).toBeDefined();
    expect(component.fetchStudent).toBeCalledWith(studentMock._id);
  });

  it("shouldn't fetchStudent when studentService.update has failed when onDialogClose", async () => {
    // given
    const reminder = {
      ...studentMock.reminders[0],
    };
    (studentServiceMock.update as jest.Mock).mockRejectedValue('err');
    setComponent();

    component.student = { ...studentMock, _id: 655777 };
    component.fetchStudent = jest.fn();

    fixture.detectChanges();

    // when
    await component.onDialogClose(reminder);

    // then
    expect(studentServiceMock.update).toBeCalled();
    try {
      // tslint:disable-next-line:no-non-null-assertion
      await studentServiceMock.update!({} as StudentQuery);
    } catch (err) {
      expect(err).toBe('err');
    }
    expect(component.fetchStudent).not.toBeCalledWith(655777);
  });

  it('should call studentService getById with student id on onDialogClose', async () => {
    // given
    const reminder = {
      ...studentMock.reminders[0],
    };
    setComponent();
    fixture.detectChanges();

    component.student = { ...studentMock };

    await component.onDialogClose(reminder);
    expect(studentServiceMock.getById).toBeCalledWith(component.student._id);
  }); // });

  function setup() {
    const studentId = 'someid';

    studentMock = {
      _id: studentId,
      username: 'student',
      password: 'Aa123456',
      firstname: 'Msw',
      lastname: 'Student',
      gender: Gender.MALE,
      reminders: [
        {
          enabled: false,
          type: 'MEDICINE',
          schedule: [],
        },
        {
          enabled: false,
          type: 'REHAB',
          schedule: [],
        },
      ],
      schedule: [],
      class: new Class(),
    };

    paramsMock = { idOrNew: studentId };

    studentReminderDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(true)),
      }),
    };

    studentServiceMock = {
      // getById: jest.fn().mockReturnValue(Promise.resolve({})),
      update: jest.fn().mockResolvedValue(studentMock._id),
      getById: jest.fn().mockResolvedValue({ ...studentMock }),
    };

    activatedRouteMock = {
      parent: {
        params: {
          subscribe: jest.fn().mockImplementation((callback) => callback(paramsMock)),
        },
      },
    } as never;

    observableAfterClosed = new Subject<IReminder>();

    afterClosedMockFn = jest.fn().mockReturnValue(observableAfterClosed);

    studentReminderDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: afterClosedMockFn,
      }),
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
          useValue: activatedRouteMock,
        },
        { provide: StudentService, useValue: studentServiceMock },
        { provide: MatDialog, useValue: studentReminderDialogMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    // setComponent();
  }

  function setComponent() {
    fixture = TestBed.createComponent(StudentDetailsRemindersComponent);
    component = fixture.componentInstance;
  }
});
