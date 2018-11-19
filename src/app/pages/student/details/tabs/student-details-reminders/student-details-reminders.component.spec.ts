import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs-compat';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentDetailsRemindersComponent } from './student-details-reminders.component';
import { StudentDetailsComponent } from '../../student-details.component';
import { MatDialog } from '@angular/material';
import { StudentService } from '../../../services/student.service';
import { IDbReminderTime } from '../../../../../models/reminder-time.model';
let studentReminderDialogMock: Partial<MatDialog>;

describe('Student Details Reminders Component', () => {
  let studentServiceMock: Partial<StudentService>;
  let fixture: ComponentFixture<StudentDetailsRemindersComponent>;
  let component: StudentDetailsRemindersComponent;
  let activatedRouteMock: Partial<ActivatedRoute>;
  let paramsMock;

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

  it('should get sorted selected hours names string from getSelectedDays', () => {
    setComponent();

    // given
    const unsortedHours = { hours: ['10:00', '07:30', '13:00'] } as IDbReminderTime;
    const expected = [['07:30', '10:00', '13:00']].join(',');

    expect(component.getSelectedHours(unsortedHours)).toEqual(expected);
  });

  // });

  function setup() {
    paramsMock = { idOrNew: 'someid' };

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

    activatedRouteMock = {
      parent: {
        params: {
          subscribe: jest.fn().mockImplementation((callback) => callback(paramsMock)),
        },
      },
    } as never;

    studentReminderDialogInitMock = {
      parent: {
        params: {
          subscribe: jest.fn().mockImplementation((callback) => callback({})),
        },
      },
    } as never;

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
