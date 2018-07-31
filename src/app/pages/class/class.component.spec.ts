import { ClassComponent } from './class.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator, MatDialog, MatPaginatorIntl } from '@angular/material';
import { ClassService } from './services/class.graphql.service';
import { classTestData } from '../../../mocks/assets/classes.mock';
import { ClassQuery } from '../../models/class.model';
import { NetworkStatus, ApolloQueryResult } from 'apollo-client';
import { Overlay, ScrollStrategyOptions, ScrollDispatcher, OverlayKeyboardDispatcher,
  OverlayPositionBuilder, OverlayContainer, ViewportRuler } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs-compat';

describe('class component', () => {
  let classServiceMock: Partial<ClassService>;
  let classDialogMock: Partial<MatDialog>;
  const testResponse = {
                        data: JSON.parse(classTestData) as ClassQuery,
                        loading: false,
                        networkStatus: 7 as NetworkStatus,
                        stale: false,
                      } as ApolloQueryResult<ClassQuery>;

  beforeEach(async () => {

    classServiceMock = {
      getAllClasses: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    classDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(true)),
      }),
    };

    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        ClassComponent,
        MatHeaderRow,
        MatRowDef,
        MatHeaderRowDef,
        MatSort,
        MatPaginator,
      ],
      providers: [
        { provide: MatDialog, useValue: classDialogMock },
        { provide: ClassService, useValue: classServiceMock },
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
    const fixture = TestBed.createComponent(ClassComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should open dialog when calling addNewClass function', () => {
    (classServiceMock.create as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(1);
    });
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.componentInstance.addNewClass();
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling deleteClass function', () => {
    (classServiceMock.delete as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(1);
    });
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.componentInstance.deleteClass('123', 'ddd', 'ddd');
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling updateClass function', () => {
    (classServiceMock.update as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(1);
    });
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.componentInstance.editClass('123', 'sad', 'asd');
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should load classes from service on page load ', () => {
    (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(Promise.resolve(testResponse));
    });
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.detectChanges();
    const DialogMock = TestBed.get(ClassService);
    expect(DialogMock.getAllClasses).toHaveBeenCalled();
  });

  it('should load correct number of classes', async () => {
    (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(Promise.resolve(testResponse));
    });
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(23);
  });
  it('should load zero classes in case of promise reject', async () => {
    (classServiceMock.getAllClasses as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(Promise.reject());
    });
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(0);
  });
  it('should clean the filter before aplying to table', async () => {
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.componentInstance.applyFilter('  AA!!BB  ');
    expect(fixture.componentInstance.dataSource.filter).toEqual('aa!!bb');
  });
});
