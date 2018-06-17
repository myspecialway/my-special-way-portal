jest.mock('./services/user.graphql.service');

import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatHeaderRow, MatDialog, MatSort } from '@angular/material';
import { UserComponent } from './user.component';
import { UserService } from './services/user.graphql.service';
import { UserType } from '../../models/user.model';

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

    // class UserServiceMock {
    //   getAllUsers = jest.fn().mockImplementation(() => {
    //     return '';
    //   });
    // }

    TestBed.configureTestingModule({
      imports: [

      ],
      declarations: [
        UserComponent,
        MatHeaderRow,
        MatRowDef,
        MatHeaderRowDef,

      ],
      providers: [
        UserService,
        { provide: MatDialog, useClass: UserDialogMock },
        // { provide: UserService, useClass: UserServiceMock },

      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    // shallow = new Shallow(UserComponent, AppModule);
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
  // it('should call getAllUsers on init', () => {
  //   const fixture = TestBed.createComponent(UserComponent);
  //   fixture.componentInstance.sort = new MatSort();
  //   fixture.componentInstance.table = new ElementRef(MatTable);
  //   fixture.componentInstance.ngOnInit();
  //   const UserServiceMock = TestBed.get(UserService);
  //   expect(UserServiceMock.getAllUsers).toHaveBeenCalled();
  // });

});
