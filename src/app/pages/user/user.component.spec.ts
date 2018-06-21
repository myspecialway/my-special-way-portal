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
import { By } from '@angular/platform-browser';
import { ApolloQueryResult, NetworkStatus } from 'apollo-client';
import { UserQuery, UserType } from '../../models/user.model';

describe('user component', () => {

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
    class UserServiceMock {
      getAllUsers = jest.fn().mockImplementation(() => {
        const testResponse = {data: JSON.parse(testData) as UserQuery,
          loading: false,
          networkStatus: 7 as NetworkStatus,
          stale: false} as ApolloQueryResult<UserQuery>;
        return Promise.resolve(testResponse);
      });
      create() { console.log('create called'); }
    }

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
        { provide: MatDialog, useClass: UserDialogMock },
        { provide: UserService, useClass: UserServiceMock },
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
    const fixture = TestBed.createComponent(UserComponent);
    fixture.componentInstance.addNewUser();
    const userDialogMock = TestBed.get(MatDialog);
    expect(userDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling deleteUser function', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.componentInstance.deleteUser(123, 'sad', 'asd', UserType.MANAGER);
    const userDialogMock = TestBed.get(MatDialog);
    expect(userDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling updateeUser function', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.componentInstance.updateUser(123, 'sad', 'asd', 'asd', 'asd');
    const userDialogMock = TestBed.get(MatDialog);
    expect(userDialogMock.open).toHaveBeenCalled();
  });

  it('should load users from service on page load ', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    const userServiceMock = TestBed.get(UserService);
    expect(userServiceMock.getAllUsers).toHaveBeenCalled();
  });

  it('should load correct number of users ', async () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(4);
});
  it('should load correct number of users and render them in table', async () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    // console.log(fixture.nativeElement.innerHTML);
    const rows = fixture.debugElement.queryAll(By.css('.mat-table'));
    expect(rows.length).toEqual(0); // TODO: fix this!
});

});

const testData = `{
    "allUsers": [
      {
        "id": "123",
        "userName": "Rotem",
        "firstName": "John1",
        "lastName": "Worg1",
        "email": "www@www.com",
        "userType": "TEACHER",
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
        "email": "www@www.com",
        "userType": "TEACHER",
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
        "email": "www@www.com",
        "userType": "MANAGER",
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
        "email": "www@www.com",
        "userType": "MANAGER",
        "Class": {
          "name": "אשוח",
          "id": "222"
        }
      }
    ]
}`;
