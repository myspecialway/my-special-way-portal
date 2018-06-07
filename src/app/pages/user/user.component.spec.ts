jest.mock('./services/user.service');

import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatHeaderRow, MatDialog } from '@angular/material';
import { UserComponent } from './user.component';
import { UserService } from './services/user.service';

describe('dashboard component', () => {
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
});
