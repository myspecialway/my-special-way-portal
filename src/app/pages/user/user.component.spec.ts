import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatHeaderRow, MatDialog, MatSort } from '@angular/material';
import { UserComponent } from './user.component';
import { UserService } from './services/user.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateCustomLoader } from '../../../mocks/translate.stub';

import {
  Overlay,
  ScrollStrategyOptions,
  ScrollDispatcher,
  ViewportRuler,
  OverlayContainer,
  OverlayPositionBuilder,
  OverlayKeyboardDispatcher,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { UserType } from '../../models/user.model';
import { userTestData } from '../../../mocks/assets/users.mock';
import { Observable } from 'rxjs-compat';

describe('user component', () => {
  let userServiceMock: Partial<UserService>;
  let userDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    userServiceMock = {
      getAllUsers: jest.fn().mockReturnValueOnce(Observable.of(userTestData.users)),
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
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateCustomLoader,
          },
        }),
      ],
      declarations: [UserComponent, MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort],
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
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should open dialog when calling addNewUser function', () => {
    (userServiceMock.create as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();

    fixture.componentInstance.addNewUser();
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling deleteUser function', () => {
    (userServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });

    const user = {
      _id: 123,
      username: 'uname',
      firstname: 'sad',
      lastname: 'asd',
      role: UserType.PRINCIPLE,
      password: '123',
      email: 'asdd@sdsd.com',
    };
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();

    fixture.componentInstance.deleteUser(user);
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling updateeUser function', () => {
    (userServiceMock.update as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const user = {
      _id: 123,
      username: 'uname',
      firstname: 'sad',
      lastname: 'asd',
      role: UserType.PRINCIPLE,
      password: '123',
      email: 'asdd@sdsd.com',
    };
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();

    fixture.componentInstance.updateUser(user);
    const DialogMock = TestBed.get(MatDialog);
    expect(DialogMock.open).toHaveBeenCalled();
  });

  it('should load users from service on page load ', () => {
    (userServiceMock.create as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve();
    });
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    const serviceMock = TestBed.get(UserService);
    expect(serviceMock.getAllUsers).toHaveBeenCalled();
  });

  it('should load correct number of users ', async () => {
    (userServiceMock.getAllUsers as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve();
    });
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(2);
  });

  it('should load zero users when recieves promise reject', async () => {
    (userServiceMock.getAllUsers as jest.Mock).mockReset();
    (userServiceMock.getAllUsers as jest.Mock).mockReturnValueOnce(Observable.of([]));
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
