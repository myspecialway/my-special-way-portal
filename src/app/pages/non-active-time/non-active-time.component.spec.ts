import { TestBed } from '@angular/core/testing';
import { MatSort, MatPaginator, MatDialog, MatHeaderRow, MatRowDef, MatHeaderRowDef } from '@angular/material';
import { Observable } from 'rxjs-compat';
import { NonActiveTime } from '../../models/non-active-time.model';
import { NonActiveTimeComponent } from './non-active-time.component';
import { NO_ERRORS_SCHEMA, Provider } from '@angular/core';
import { NonActiveTimeService } from '../../services/non-active-time/non-active-time.graphql.service';
import { EditNonActiveTimeDialogComponent } from './dialogs/edit/edit-non-active-time.dialog';
import { nonActiveTimeTestData } from '../../../mocks/assets/nonActiveTime.mock';
import { DeleteNonActiveTimeDialogComponent } from './dialogs/delete/delete-non-active-time-dialogue.component';

describe('non active time component', () => {
  let nonActiveTimeServiceMock: Partial<NonActiveTimeService>;
  const singleNonActiveTime = nonActiveTimeTestData.nonActiveTimes[0];
  let matDialogMock: Partial<MatDialog>;
  function matDialogMockFactory(result) {
    const mock = {
      open: jest.fn().mockImplementation(() => ({
        afterClosed: mock.open,
        pipe: mock.open,
        subscribe: jest.fn().mockImplementation((func) => {
          func(result);
        }),
      })),
    };
    return mock;
  }

  async function createFixture(providers: Provider[] = []) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [NonActiveTimeComponent, MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator],
      providers: [
        { provide: NonActiveTimeService, useValue: nonActiveTimeServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        ...providers,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    return fixture;
  }

  beforeEach(async () => {
    nonActiveTimeServiceMock = {
      getAllNonActiveTimes: jest.fn().mockImplementationOnce(() => {
        return Observable.of(nonActiveTimeTestData.nonActiveTimes);
      }),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    matDialogMock = matDialogMockFactory(singleNonActiveTime);
  });

  it('should render component as described in snapshot', async () => {
    expect(await createFixture()).toMatchSnapshot();
  });

  it('should load correct number of Non active times', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(nonActiveTimeTestData.nonActiveTimes);
    });
    const fixture = await createFixture();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(nonActiveTimeTestData.nonActiveTimes.length);
  });

  it('should load zero Non active times in case of error', async () => {
    const nonActiveTimeServiceMockError = (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(
      () => {
        return Observable.throwError('testing with errors');
      },
    );
    const fixture = await createFixture([{ provide: NonActiveTimeService, useValue: nonActiveTimeServiceMockError }]);
    expect(fixture.componentInstance.dataSource.data.length).toEqual(0);
  });

  it('should open delete component dialog', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(nonActiveTimeTestData.nonActiveTimes);
    });
    (nonActiveTimeServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const fixture = await createFixture();
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData.nonActiveTimes[1]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(matDialogMock.open).toHaveBeenCalledWith(DeleteNonActiveTimeDialogComponent, {
      data: { _id: nonActiveTimeTestData.nonActiveTimes[1]._id, title: nonActiveTimeTestData.nonActiveTimes[1].title },
    });
  });

  it('should call deleteNonActiveTime when user confirms', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(nonActiveTimeTestData.nonActiveTimes);
    });
    (nonActiveTimeServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const fixture = await createFixture([{ provide: MatDialog, useValue: matDialogMockFactory(true) }]);
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData.nonActiveTimes[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(nonActiveTimeServiceMock.delete).toHaveBeenCalledWith(nonActiveTimeTestData.nonActiveTimes[0]._id);
  });

  it('should not call deleteNonActiveTime when user cancels', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(nonActiveTimeTestData.nonActiveTimes);
    });
    (nonActiveTimeServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const fixture = await createFixture([{ provide: MatDialog, useValue: matDialogMockFactory(false) }]);
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData.nonActiveTimes[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(nonActiveTimeServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should get empty array if no Non active times are defined', async () => {
    const nonActiveTimeServiceMockNull = (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(
      () => {
        return Observable.of(null);
      },
    );
    const fixture = await createFixture([{ provide: NonActiveTimeService, useValue: nonActiveTimeServiceMockNull }]);
    expect(fixture.componentInstance.dataSource.data).toEqual([]);
  });

  it('should get correct class-display string for an all day event', async () => {
    const fixture = await createFixture();
    expect(fixture.componentInstance.getClassesDisplayData(nonActiveTimeTestData.nonActiveTimes[3])).toEqual(
      'כל הכיתות',
    );
  });

  it('should open dialog for create new nonActiveTime', async () => {
    const fixture = await createFixture();
    fixture.componentInstance.addNonActiveTime();
    expect(matDialogMock.open).toBeCalledWith(EditNonActiveTimeDialogComponent, { data: {} });
    expect(nonActiveTimeServiceMock.create).toBeCalledWith(
      singleNonActiveTime.title,
      singleNonActiveTime.isAllDayEvent,
      singleNonActiveTime.startDateTime,
      singleNonActiveTime.endDateTime,
      singleNonActiveTime.isAllClassesEvent,
      singleNonActiveTime.classes ? singleNonActiveTime.classes.map((c) => c._id) : [],
    );
  });

  it('should open dialog for create new nonActiveTime even if there is no classes', async () => {
    const matDialogMockNoClassID = matDialogMockFactory(
      Object.assign(JSON.parse(JSON.stringify(singleNonActiveTime)), { classes: undefined }),
    );
    const fixture = await createFixture([{ provide: MatDialog, useValue: matDialogMockNoClassID }]);
    fixture.componentInstance.addNonActiveTime();
    expect(matDialogMockNoClassID.open).toBeCalled();
    expect(nonActiveTimeServiceMock.create).toBeCalledWith(
      singleNonActiveTime.title,
      singleNonActiveTime.isAllDayEvent,
      singleNonActiveTime.startDateTime,
      singleNonActiveTime.endDateTime,
      singleNonActiveTime.isAllClassesEvent,
      [],
    );
  });

  it('should open dialog for update exist nonActiveTime', async () => {
    const fixture = await createFixture();
    fixture.componentInstance.editNonActiveTime(singleNonActiveTime);
    expect(matDialogMock.open).toBeCalledWith(EditNonActiveTimeDialogComponent, { data: singleNonActiveTime });
    expect(nonActiveTimeServiceMock.update).toBeCalledWith(
      singleNonActiveTime._id,
      singleNonActiveTime.title,
      singleNonActiveTime.isAllDayEvent,
      singleNonActiveTime.startDateTime,
      singleNonActiveTime.endDateTime,
      singleNonActiveTime.isAllClassesEvent,
      singleNonActiveTime.classes ? singleNonActiveTime.classes.map((c) => c._id) : [],
    );
  });

  it('should open dialog for update exist nonActiveTime even if there is no classes', async () => {
    const matDialogMockNoClassID = matDialogMockFactory(
      Object.assign(JSON.parse(JSON.stringify(singleNonActiveTime)), { classes: undefined }),
    );
    const fixture = await createFixture([{ provide: MatDialog, useValue: matDialogMockNoClassID }]);
    fixture.componentInstance.editNonActiveTime(singleNonActiveTime);
    expect(matDialogMockNoClassID.open).toBeCalled();
    expect(nonActiveTimeServiceMock.update).toBeCalledWith(
      singleNonActiveTime._id,
      singleNonActiveTime.title,
      singleNonActiveTime.isAllDayEvent,
      singleNonActiveTime.startDateTime,
      singleNonActiveTime.endDateTime,
      singleNonActiveTime.isAllClassesEvent,
      [],
    );
  });

  it('should get error for a non all day event with no classes', async () => {
    const badNonActiveTime: NonActiveTime = {
      _id: '5c0fbbb04e773c17106afdb0',
      title: 'best title ever 2222222',
      isAllDayEvent: true,
      startDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
      endDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
      isAllClassesEvent: false,
    };
    const fixture = await createFixture();
    let err = false;
    try {
      fixture.componentInstance.getClassesDisplayData(badNonActiveTime);
    } catch (e) {
      err = true;
    }
    expect(err).toBeTruthy();
  });

  it('should get correct class-display string for an all day event with one class', async () => {
    const fixture = await createFixture();
    expect(fixture.componentInstance.getClassesDisplayData(nonActiveTimeTestData.nonActiveTimes[2])).toEqual('פטל');
  });

  it('should get correct class-display string for an all day event with multiple classes', async () => {
    const fixture = await createFixture();
    expect(fixture.componentInstance.getClassesDisplayData(nonActiveTimeTestData.nonActiveTimes[1])).toEqual(
      'טיטאן + 1',
    );
  });

  it('should get correct date-display string for an event startDate===endDate', async () => {
    const fixture = await createFixture();
    expect(fixture.componentInstance.getDatesDisplayData(nonActiveTimeTestData.nonActiveTimes[3])).toEqual(
      '2018 M12 10',
    );
  });

  it('should get correct date-display string for an event startDate!==endDate', async () => {
    const fixture = await createFixture();
    expect(fixture.componentInstance.getDatesDisplayData(nonActiveTimeTestData.nonActiveTimes[1])).toEqual(
      '2018 M12 10 עד 2018 M12 11',
    );
  });

  it('should get correct time-display string for an all day event', async () => {
    const fixture = await createFixture();
    expect(fixture.componentInstance.getHoursDisplayData(nonActiveTimeTestData.nonActiveTimes[3])).toEqual('כל היום');
  });

  it('should get correct time-display string for a non all day event', async () => {
    const fixture = await createFixture();
    const options = { hour: 'numeric', minute: 'numeric' };
    const startDateTime = new Date(nonActiveTimeTestData.nonActiveTimes[1].startDateTime).toLocaleTimeString(
      'he-IL',
      options,
    );
    const endDateTime = new Date(nonActiveTimeTestData.nonActiveTimes[1].endDateTime).toLocaleTimeString(
      'he-IL',
      options,
    );

    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.getHoursDisplayData(nonActiveTimeTestData.nonActiveTimes[1])).toEqual(
      startDateTime + ' עד ' + endDateTime,
    );
  });

  it('should do nothing if there is no output from the dialog', async () => {
    const matDialogMockNoResult = matDialogMockFactory(null);
    const fixture = await createFixture([{ provide: MatDialog, useValue: matDialogMockNoResult }]);
    fixture.componentInstance.addNonActiveTime();
    expect(matDialogMockNoResult.open).toBeCalled();
    expect(nonActiveTimeServiceMock.create).not.toBeCalled();
  });
});
