import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator, MatDialog } from '@angular/material';

import { Observable } from 'rxjs-compat';
import { NonActiveTimeService } from '../../services/non-active-time/non-active-time.graphql.service';
import { NonActiveTime } from '../../models/non-active-time.model';
import { NonActiveTimeComponent } from './non-active-time.component';

describe('non active time component', () => {
  let nonActiveTimeServiceMock: Partial<NonActiveTimeService>;
  let nonActiveTimeTestData: NonActiveTime[] = [];

  let nonActiveTimeDialogueMock: Partial<MatDialog>;
  let nonActiveTimeDialogueMockValue: boolean;

  beforeAll(async () => {
    nonActiveTimeTestData = [
      {
        _id: '5c0fa61642d6052794ab44c8',
        title: 'best title ever',
        isAllDayEvent: false,
        startDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
        endDateTime: 'Tue, 11 Dec 2018 14:23:09 GMT',
        isAllClassesEvent: false,
        classes: [
          {
            _id: '5c04f3814408e8334404ef16',
            name: 'טיטאן',
          },
          {
            _id: '5c04f3814408e8334404ef17',
            name: 'פטל',
          },
        ],
      },
      {
        _id: '5c0fbbb04e773c17106afdb0',
        title: 'best title ever 2222222',
        isAllDayEvent: true,
        startDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
        endDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
        isAllClassesEvent: false,
        classes: [
          {
            _id: '5c04f3814408e8334404ef17',
            name: 'פטל',
          },
        ],
      },
      {
        _id: '5c0fbbb04e773c17106afdb0',
        title: 'best title ever 2222222',
        isAllDayEvent: true,
        startDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
        endDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
        isAllClassesEvent: true,
      },
    ];
  });

  beforeEach(async () => {
    nonActiveTimeServiceMock = {
      getAllNonActiveTimes: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    nonActiveTimeDialogueMockValue = true;
    nonActiveTimeDialogueMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockImplementation(() => Observable.of(nonActiveTimeDialogueMockValue)),
      }),
    };

    TestBed.configureTestingModule({
      imports: [],
      declarations: [NonActiveTimeComponent, MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatPaginator],
      providers: [
        { provide: NonActiveTimeService, useValue: nonActiveTimeServiceMock },
        { provide: MatDialog, useValue: nonActiveTimeDialogueMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should load correct number of Non active times ', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(nonActiveTimeTestData);
    });
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(3);
  });

  it('should load zero Non active times in case of error', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.throwError('testing with errors');
    });
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(0);
  });

  it('should open delete component dialogue', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(nonActiveTimeTestData);
    });
    (nonActiveTimeServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(nonActiveTimeDialogueMock.open).toHaveBeenCalled();
  });
  it('should call deleteNonActiveTime when user confirms ', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(nonActiveTimeTestData);
    });
    (nonActiveTimeServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    nonActiveTimeDialogueMockValue = true;
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(nonActiveTimeServiceMock.delete).toHaveBeenCalledWith(nonActiveTimeTestData[0]._id);
  });

  it('should not call deleteNonActiveTime when user cancels ', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(nonActiveTimeTestData);
    });
    (nonActiveTimeServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    nonActiveTimeDialogueMockValue = false;

    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    await fixture.componentInstance.deleteNonActiveTime(nonActiveTimeTestData[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(nonActiveTimeServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should get empty array if no Non active times are defined', async () => {
    (nonActiveTimeServiceMock.getAllNonActiveTimes as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(null);
    });
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.dataSource.data).toEqual([]);
  });

  it('should get correct class-display string for an all day event', async () => {
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.getClassesDisplayData(nonActiveTimeTestData[2])).toEqual('כל הכיתות');
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
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    let err = false;
    try {
      fixture.componentInstance.getClassesDisplayData(badNonActiveTime);
    } catch (e) {
      err = true;
    }
    expect(err).toBeTruthy();
  });

  it('should get correct class-display string for an all day event with one class', async () => {
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.getClassesDisplayData(nonActiveTimeTestData[1])).toEqual('פטל');
  });

  it('should get correct class-display string for an all day event with multiple classes', async () => {
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.getClassesDisplayData(nonActiveTimeTestData[0])).toEqual('טיטאן + 1');
  });

  it('should get correct date-display string for an event startDate===endDate', async () => {
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.getDatesDisplayData(nonActiveTimeTestData[1])).toEqual('2018 M12 10');
  });

  it('should get correct date-display string for an event startDate!==endDate', async () => {
    const fixture = TestBed.createComponent(NonActiveTimeComponent);
    await fixture.componentInstance.ngOnInit(); // this triggers the subCleaner instantiator.
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.componentInstance.getDatesDisplayData(nonActiveTimeTestData[0])).toEqual(
      '2018 M12 10 עד 2018 M12 10',
    );
  });
});
