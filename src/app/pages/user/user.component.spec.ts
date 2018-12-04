import { TestBed, fakeAsync } from '@angular/core/testing';
import {
  MatDialog,
  MatSort,
  MatTableModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule,
} from '@angular/material';
import { UserComponent } from './user.component';
import { UserService } from './services/user.service';
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
import { UserType, User } from '../../models/user.model';
import { userTestData } from '../../../mocks/assets/users.mock';
import { Observable } from 'rxjs-compat';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Class } from '../../models/class.model';

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
        NoopAnimationsModule,
        RouterTestingModule,
        MatTooltipModule,
        MatSelectModule,
        MatTableModule,
        MatIconModule,
        CdkTableModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [UserComponent, MatSort],
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

  it('should not show no records massage if there is data', fakeAsync(() => {
    // given
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();

    // then
    expect(fixture.componentInstance.showNoRecords).toBe(false);
  }));

  it('should show no records massage if there is no data', fakeAsync(() => {
    // given
    userServiceMock.getAllUsers = jest.fn().mockReturnValueOnce(Observable.of([]));
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();

    // then
    expect(fixture.componentInstance.showNoRecords).toBe(true);
  }));

  describe('sort table', () => {
    it('should sort users by firstname+lastname', async () => {
      const fixture = TestBed.createComponent(UserComponent);
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const data = fixture.componentInstance.dataSource.data;
      for (let i = 0; i < data.length - 1; i++) {
        const user1 = data[i].firstname + data[i].lastname;
        const user2 = data[i + 1].firstname + data[i + 1].lastname;
        const comapare = user1.localeCompare(user2);
        expect(comapare).toEqual(-1);
      }
    });

    it('should sort users by class name', () => {
      const fixture = TestBed.createComponent(UserComponent);
      fixture.detectChanges();
      const user = { firstname: 'a', lastname: 'b', class: { name: 'class name' } } as User & { class: Class };
      const result = fixture.componentInstance.dataSource.sortingDataAccessor(user, 'class');
      expect(result).toBe(user.class.name);
    });
  });

  describe('filter table', () => {
    describe('filter by name', () => {
      it('should hide filter by default', () => {
        const fixture = TestBed.createComponent(UserComponent);
        expect(fixture.componentInstance.showNameFilter).toBe(false);
      });

      it('should show filter name input after call to to toggleNameFilter', () => {
        const fixture = TestBed.createComponent(UserComponent);
        fixture.componentInstance.toggleNameFilter();
        expect(fixture.componentInstance.showNameFilter).toBe(true);
      });

      it('should show filter name input in any case, if there is filter applyed', () => {
        const fixture = TestBed.createComponent(UserComponent);
        fixture.componentInstance.toggleNameFilter();
        fixture.componentInstance.nameFilter.setValue('some text');
        fixture.componentInstance.toggleNameFilter();
        expect(fixture.componentInstance.showNameFilter).toBe(true);
        fixture.componentInstance.toggleNameFilter();
        expect(fixture.componentInstance.showNameFilter).toBe(true);
      });

      it('should show no records massage if the name filter has no macth', fakeAsync(() => {
        // given
        const fixture = TestBed.createComponent(UserComponent);
        fixture.detectChanges();

        // when
        const component = fixture.componentInstance;
        component.showNoRecords = false;
        component.dataSource.filteredData = [];
        fixture.debugElement.query(By.css('.mat-column-name mat-icon')).nativeElement.click();
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('.mat-column-name input'));
        input.triggerEventHandler('input', { target: { value: 'no such user' } });
        fixture.detectChanges();

        // then
        expect(fixture.componentInstance.showNoRecords).toBe(true);
      }));
    });

    describe('filter by class name', () => {
      it('should hide filter by default', () => {
        const fixture = TestBed.createComponent(UserComponent);
        expect(fixture.componentInstance.showClassFilter).toBe(false);
      });

      it("should show filter's class input after call to to toggleClassFilter", () => {
        const fixture = TestBed.createComponent(UserComponent);
        fixture.componentInstance.toggleClassFilter();
        expect(fixture.componentInstance.showClassFilter).toBe(true);
      });

      it("should show filter's class input in any case, if there is filter applyed", () => {
        const fixture = TestBed.createComponent(UserComponent);
        fixture.componentInstance.toggleClassFilter();
        fixture.componentInstance.classFilter.setValue('some text');
        fixture.componentInstance.toggleClassFilter();
        expect(fixture.componentInstance.showClassFilter).toBe(true);
        fixture.componentInstance.toggleClassFilter();
        expect(fixture.componentInstance.showClassFilter).toBe(true);
      });

      it('should show no records massage if the class filter has no match', fakeAsync(() => {
        // given
        const fixture = TestBed.createComponent(UserComponent);
        fixture.detectChanges();

        // when
        const component = fixture.componentInstance;
        component.showNoRecords = false;
        component.dataSource.filteredData = [];
        fixture.debugElement.query(By.css('.mat-column-class mat-icon')).nativeElement.click();
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('.mat-column-class input'));
        input.triggerEventHandler('input', { target: { value: 'no such class' } });
        fixture.detectChanges();

        // then
        expect(fixture.componentInstance.showNoRecords).toBe(true);
      }));
    });
  });
});
