import { ClassComponent } from './class.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatDialog } from '@angular/material';
import { ClassService } from './services/class.graphql.service';
import { classTestData } from '../../../mocks/assets/classes.mock';
import {
  Overlay,
  ScrollStrategyOptions,
  ScrollDispatcher,
  OverlayKeyboardDispatcher,
  OverlayPositionBuilder,
  OverlayContainer,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs-compat';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { MSWSnackbar } from '../../services/msw-snackbar/msw-snackbar.service';
import { Router } from '@angular/router';
import 'rxjs-compat/add/observable/of';

describe('class component', () => {
  let classServiceMock: Partial<ClassService>;
  let classDialogMock: Partial<MatDialog>;
  let scheduleServiceMock: Partial<ScheduleService>;
  let snackbarMock: Partial<MSWSnackbar>;
  let routeMock: Partial<Router>;
  let fixture: ComponentFixture<ClassComponent>;
  let component: ClassComponent;

  beforeEach(async () => {
    classServiceMock = {
      getAllClasses: jest.fn().mockReturnValueOnce(Observable.of(classTestData.classes)),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    classDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(true)),
      }),
    };

    snackbarMock = {
      displayTimedMessage: jest.fn(),
    };

    scheduleServiceMock = {
      grades: {
        a: 'א',
        b: 'ב',
        c: 'ג',
        d: 'ד',
        e: 'ה',
        f: 'ו',
      },
    };

    routeMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [],
      declarations: [ClassComponent, MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort],
      providers: [
        { provide: MatDialog, useValue: classDialogMock },
        { provide: ClassService, useValue: classServiceMock },
        { provide: ScheduleService, useValue: scheduleServiceMock },
        { provide: MSWSnackbar, useValue: snackbarMock },
        { provide: Router, useValue: routeMock },
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

    fixture = TestBed.createComponent(ClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render component as described in snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should open dialog when calling deleteClass function when no students assigned to the class', () => {
    (classServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });

    component.deleteClass('123', 'ddd', 'ddd', 0);
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should not open a dialog when calling deleteClass function when students are assigned to the class', () => {
    (classServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(0);
    });
    component.deleteClass('123', 'ddd', 'ddd', 1);
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).not.toHaveBeenCalled();
  });

  it('should open a snackbar error message when calling deleteClass function when students are assigned to the class', () => {
    (classServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(0);
    });
    component.deleteClass('123', 'ddd', 'ddd', 1);
    const SnackbarMock = TestBed.get(MSWSnackbar);
    expect(SnackbarMock.displayTimedMessage).toHaveBeenCalled();
  });

  it('should load classes from service on page load ', () => {
    (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(classTestData.classes);
    });
    const DialogMock = TestBed.get(ClassService);
    expect(DialogMock.getAllClasses).toHaveBeenCalled();
  });

  it('should load correct number of classes', async () => {
    (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(classTestData.classes);
    });
    await fixture.whenRenderingDone();
    expect(component.dataSource.data.length).toEqual(23);
  });
  it('should load zero classes in case of promise reject', async () => {
    const getAllClassesMock = classServiceMock.getAllClasses as jest.Mock;
    getAllClassesMock.mockReset();
    getAllClassesMock.mockImplementationOnce(() => Observable.of([]));

    // await fixture.whenRenderingDone();
    component.ngOnInit();
    expect(component.dataSource.data.length).toEqual(0);
  });

  it('should open edit-class-dialog ', () => {
    component.navigate('class/some-class-id');
    expect(routeMock.navigate).toHaveBeenCalled();
  });
});
