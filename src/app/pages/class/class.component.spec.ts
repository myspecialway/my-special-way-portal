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

describe('class component', () => {
  beforeEach(async () => {

    class ClassDialogMock {
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
    class ClassServiceMock {
      getAllClasses = jest.fn().mockImplementation(() => {
        const testResponse = {data: JSON.parse(classTestData) as ClassQuery,
          loading: false,
          networkStatus: 7 as NetworkStatus,
          stale: false} as ApolloQueryResult<ClassQuery>;
        return Promise.resolve(testResponse);
      });
      create() { console.log('create called'); }
    }

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
        { provide: MatDialog, useClass: ClassDialogMock },
        { provide: ClassService, useClass: ClassServiceMock },
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
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.componentInstance.addNewClass();
    const classDialogMock = TestBed.get(MatDialog);
    expect(classDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling deleteClass function', () => {
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.componentInstance.deleteClass(123, 'ddd', 'ddd');
    const classDialogMock = TestBed.get(MatDialog);
    expect(classDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling updateClass function', () => {
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.componentInstance.editClass(123, 'sad', 'asd');
    const classDialogMock = TestBed.get(MatDialog);
    expect(classDialogMock.open).toHaveBeenCalled();
  });

  it('should load classes from service on page load ', () => {
    const fixture = TestBed.createComponent(ClassComponent);
    fixture.detectChanges();
    const classServiceMock = TestBed.get(ClassService);
    expect(classServiceMock.getAllClasses).toHaveBeenCalled();
  });

  // it('should load correct number of classes', async () => {
  //     const fixture = TestBed.createComponent(ClassComponent);
  //     fixture.detectChanges();
  //     await fixture.whenRenderingDone();
  //     expect(fixture.componentInstance.dataSource.data.length).toEqual(1);
  // });

  // it('should load correct number of users and render them in table', async () => {
  //     const fixture = TestBed.createComponent(ClassComponent);
  //     fixture.detectChanges();
  //     await fixture.whenRenderingDone();
  //     // console.log(fixture.nativeElement.innerHTML);
  //     const rows = fixture.debugElement.queryAll(By.css('.mat-table'));
  //     expect(rows.length).toEqual(0); // TODO: fix this!
  // });
});
