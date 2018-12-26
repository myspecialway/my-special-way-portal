import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { DeleteBlockDialogComponent } from './dialogs/delete/delete-block.dialog';
import { AddUpdateBlockDialogComponent } from './dialogs/add-update/add-update-block.dialog';
import { MapsService } from './services/maps.container.service';
import { MapsContainerComponent } from './maps.container.component';
import { mockedLocations } from './../../../../mocks/assets/locations.mock';
import { MSWSnackbar } from '../../../services/msw-snackbar/msw-snackbar.service';
import { of } from 'rxjs/observable/of';
import {
  Overlay,
  ScrollStrategyOptions,
  ScrollDispatcher,
  OverlayKeyboardDispatcher,
  OverlayPositionBuilder,
  OverlayContainer,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs-compat';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRow, MatRowDef, MatHeaderRowDef, MatInput, MatDialog } from '@angular/material';
import { LocationService } from '../../../services/location/location.graphql.service';
import BlockedSection from '../../../models/blocked-section.model';
import { Subject } from 'rxjs-compat';
const locationServiceMock = {
  getLocations: jest.fn().mockReturnValue(Promise.resolve(mockedLocations)),
  getLocationsFeed$: jest.fn().mockReturnValue(of(mockedLocations)),
};
describe('MapsContainerComponent', () => {
  let fixture: ComponentFixture<MapsContainerComponent>;
  let mapsServiceMock: Partial<MapsService>;
  let mapsDialogMock: Partial<MatDialog>;
  let mswSnackbarMock: Partial<MSWSnackbar>;
  const mockedblockedSections = [
    {
      reason: "מרתון תל אביב'",
      from: 'A',
      to: 'B',
    },
  ];

  beforeEach(async () => {
    mapsServiceMock = {
      getAllBlockedSections: jest.fn().mockReturnValue(Observable.of(mockedblockedSections)),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mapsDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(true)),
      }),
    };

    mswSnackbarMock = {
      displayTimedMessage: jest.fn(),
    } as Partial<MSWSnackbar>;

    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        MapsContainerComponent,
        AddUpdateBlockDialogComponent,
        DeleteBlockDialogComponent,
        MatHeaderRow,
        MatRowDef,
        MatHeaderRowDef,
        MatInput,
      ],
      providers: [
        { provide: MatDialog, useValue: mapsDialogMock },
        { provide: MapsService, useValue: mapsServiceMock },
        { provide: LocationService, useValue: locationServiceMock },
        { provide: MSWSnackbar, useValue: mswSnackbarMock },
        { provide: APP_BASE_HREF, useValue: '/' },
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

  it('should match snapshot', () => {
    fixture = TestBed.createComponent(MapsContainerComponent);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should load correct number of blocked sections ', async () => {
    (mapsServiceMock.getAllBlockedSections as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(mockedblockedSections);
    });
    fixture = TestBed.createComponent(MapsContainerComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.dataSource.data.length).toEqual(1);
  });

  it('should call mapsServiceMock.update when calling addOrEditBlock with a blockedSection ', async () => {
    (mapsServiceMock.getAllBlockedSections as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(mockedblockedSections);
    });
    (mapsServiceMock.update as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const newBlockedSection = {
      reason: 'New reason',
      from: 'B',
      to: 'D',
    };
    fixture = TestBed.createComponent(MapsContainerComponent);
    await fixture.componentInstance.ngOnInit();
    fixture.componentInstance.addOrEditBlock(newBlockedSection);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(mapsServiceMock.update).toHaveBeenCalled();
  });

  it('should call mapsServiceMock.create when calling addOrEditBlock without blockedSection ', async () => {
    (mapsServiceMock.getAllBlockedSections as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(mockedblockedSections);
    });
    (mapsServiceMock.create as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });

    fixture = TestBed.createComponent(MapsContainerComponent);
    await fixture.componentInstance.ngOnInit();
    fixture.componentInstance.addOrEditBlock();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(mapsServiceMock.create).toHaveBeenCalled();
  });

  it('should call mapsServiceMock.delete when calling deleteBlock with a blockedSection ', async () => {
    (mapsServiceMock.getAllBlockedSections as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(mockedblockedSections);
    });
    (mapsServiceMock.delete as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });

    const blockToDelete = {
      reason: "מרתון תל אביב'",
      from: 'A',
      to: 'B',
    };
    fixture = TestBed.createComponent(MapsContainerComponent);
    await fixture.componentInstance.ngOnInit();
    fixture.componentInstance.deleteBlock(blockToDelete);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(mapsServiceMock.delete).toHaveBeenCalled();
  });
});
