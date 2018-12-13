import { TestBed } from '@angular/core/testing';
import { MatSort, MatPaginator, MatDialog, MatTableModule } from '@angular/material';

import { Observable } from 'rxjs-compat';
import { NonActiveTimeComponent } from './non-active-time.component';
import { NO_ERRORS_SCHEMA, Provider } from '@angular/core';
import { NonActiveTimeService } from '../../services/non-active-time/non-active-time.graphql.service';
import { EditNonActiveTimeDialogComponent } from './dialogs/edit/edit-non-active-time.dialog';
import { nonActiveTimeTestData } from '../../../mocks/assets/nonActiveTime.mock';
import { CdkTableModule } from '@angular/cdk/table';
import { DeleteNonActiveTimeDialogueComponent } from './delete/delete-non-active-time-dialogue.component';

describe('NonActiveTimeComponent', () => {
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
      imports: [CdkTableModule, MatTableModule],
      declarations: [NonActiveTimeComponent, MatSort, MatPaginator],
      providers: [
        { provide: NonActiveTimeService, useValue: nonActiveTimeServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        ...providers,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    // fixture.componentInstance.subCollector = { add: jest.fn() };
    await fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    nonActiveTimeServiceMock = {
      getAllNonActiveTimes: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    matDialogMock = matDialogMockFactory(singleNonActiveTime);
  });

  it('should render component as described in snapshot', () => {
    expect(createFixture()).toMatchSnapshot();
  });

  it('should load correct number of Non active times', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(nonActiveTimeTestData.nonActiveTimes);
    });
    const fixture = await createFixture();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(nonActiveTimeTestData.nonActiveTimes.length);
  });

  it('should load zero Non active times in case of promise reject', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of([]);
    });
    const fixture = await createFixture();
    await fixture.whenRenderingDone();
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
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(matDialogMock.open).toHaveBeenCalledWith(DeleteNonActiveTimeDialogueComponent);
  });

  it('should call deleteNonActiveTime when user confirms', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(nonActiveTimeTestData);
    });
    (nonActiveTimeServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const fixture = await createFixture([{ provide: MatDialog, useValue: matDialogMockFactory(Observable.of(true)) }]);

    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
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
    const fixture = await createFixture([{ provide: MatDialog, useValue: matDialogMockFactory(Observable.of(false)) }]);
    //await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData.nonActiveTimes[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(nonActiveTimeServiceMock.delete).not.toHaveBeenCalled();
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

  it('should do nothing if there is no output from the dialog', async () => {
    const matDialogMockNoResult = matDialogMockFactory(null);
    const fixture = await createFixture([{ provide: MatDialog, useValue: matDialogMockNoResult }]);
    fixture.componentInstance.addNonActiveTime();
    expect(matDialogMockNoResult.open).toBeCalled();
    expect(nonActiveTimeServiceMock.create).not.toBeCalled();
  });
});
