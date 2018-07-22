import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef,
         MatHeaderRow, MatDialog,
         MatSort, MatPaginator,
         MatPaginatorIntl,
        } from '@angular/material';
import { UserComponent } from './user.component';
import { UserService } from './services/user.graphql.service';
import { Overlay, ScrollStrategyOptions, ScrollDispatcher,
         ViewportRuler, OverlayContainer, OverlayPositionBuilder,
         OverlayKeyboardDispatcher } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ApolloQueryResult, NetworkStatus } from 'apollo-client';
import { UserQuery, UserType } from '../../models/user.model';
import { userTestData } from '../../../mocks/assets/users.mock';
import { Observable } from 'rxjs-compat';
import { Class } from '../../models/class.model';

describe('user component', () => {
  let userServiceMock: Partial<UserService>;
  let userDialogMock: Partial<MatDialog>;
  const testResponse = {
                        data: JSON.parse(userTestData) as UserQuery,
                        loading: false,
                        networkStatus: 7 as NetworkStatus,
                        stale: false,
                      } as ApolloQueryResult<UserQuery>;

  beforeEach(async () => {

    userServiceMock = {
      getAllUsers: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    userDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(true)),
      }),
    };

    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        UserComponent,
        MatHeaderRow,
        MatRowDef,
        MatHeaderRowDef,
        MatSort,
        MatPaginator,
      ],
      providers: [
        { provide: MatDialog, useValue: userDialogMock },
        { provide: UserService, useValue: userServiceMock },
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
    const fixture = TestBed.createComponent(UserComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should open dialog when calling addNewUser function', () => {
    (userServiceMock.create as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve({userName: 'asd', firstName: 'asd', lastName: 'asd', _id: 123});
    });
    userDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of({userName: 'asd', firstName: 'asd', lastName: 'asd', _id: 123})),
      }),
    };
    TestBed.overrideProvider(MatDialog, { useValue: userDialogMock });
    const fixture = TestBed.createComponent(UserComponent);
    fixture.componentInstance.addNewUser();
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling deleteUser function', () => {
    (userServiceMock.delete as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(1);
    });
    userDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(true)),
      }),
    };
    TestBed.overrideProvider(MatDialog, { useValue: userDialogMock });
    const fixture = TestBed.createComponent(UserComponent);
    fixture.componentInstance.deleteUser(123, 'sad');
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling updateeUser function', () => {
    (userServiceMock.update as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(1);
    });
    userDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(userTestData[0])),
      }),
    };
    const fixture = TestBed.createComponent(UserComponent);
    fixture.componentInstance.updateUser(123, 'sad', 'asd', 'asd', 'asd', new Class(), UserType.PRINCIPLE);
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should load users from service on page load ', () => {
    (userServiceMock.create as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(testResponse);
    });
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    const serviceMock = TestBed.get(UserService);
    expect(serviceMock.getAllUsers).toHaveBeenCalled();
  });

  it('should load correct number of users ', async () => {
    (userServiceMock.getAllUsers as jest.Mock).mockImplementationOnce(
      () => {return Promise.resolve(testResponse);
    });
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(2);
});

  it('should load zero users when recieves promise reject', async () => {
    (userServiceMock.getAllUsers as jest.Mock).mockImplementationOnce(
      () => {return Promise.reject;
    });
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(0);
  });

  it('should use the type methode to translate TEACHER to hebrew', async () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.toHebrew('TEACHER' as UserType)).toEqual('מורה');
  });
  it('should use the type methode to translate ORINCIPAL to hebrew', async () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.toHebrew('PRINCIPLE' as UserType)).toEqual('מנהל');
  });
  it('should clean the filter before aplying to table', async () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.componentInstance.applyFilter('  AA!!BB  ');
    expect(fixture.componentInstance.dataSource.filter).toEqual('aa!!bb');
  });

});
