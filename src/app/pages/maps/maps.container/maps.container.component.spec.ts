import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { DeleteBlockDialogComponent } from './dialogs/delete/delete-block.dialog';
import { AddUpdateBlockDialogComponent } from './dialogs/add-update/add-update-block.dialog';
import { MapsService } from './services/maps.container.service';
import { MapsContainerComponent } from './maps.container.component';
import { MSWSnackbar } from '../../../services/msw-snackbar/msw-snackbar.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { MatHeaderRow, MatRowDef, MatHeaderRowDef, MatInput, MatDialog, MatDialogRef } from '@angular/material';
import { LocationService } from '../../../services/location/location.graphql.service';

describe('MapsContainerComponent', () => {
  let fixture: ComponentFixture<MapsContainerComponent>;
  let mapsServiceMock: Partial<MapsService>;
  let locationServiceMock: Partial<LocationService>;
  let mapsDialogMock: Partial<MatDialog>;
  let mswSnackbarMock: Partial<MSWSnackbar>;
  const mockedblockedSections = [
    {
      reason: "מרתון תל אביב'",
      from: '5c3393394287a53304b740db',
      to: '5c3393394287a53304b740d5',
    },
  ];

  const mockedLocations = [
    {
      _id: '5c3393394287a53304b740db',
      name: 'אולם ספורט',
      location_id: 'A90',
      position: {
        floor: 0,
      },
    },
    {
      _id: '5c3393394287a53304b740d5',
      name: 'ברזיה אולם ספורט',
      location_id: 'A96',
      position: {
        floor: 0,
      },
    },
    {
      _id: 'A',
      name: 'ברזיה אולם ספורט',
      location_id: 'A',
      position: {
        floor: 0,
      },
    },
    {
      _id: 'B',
      name: 'ברזיה אולם',
      location_id: 'B',
      position: {
        floor: 0,
      },
    },
  ];

  beforeEach(async () => {
    mapsServiceMock = {
      getAllBlockedSections: jest.fn().mockReturnValue(Observable.of(mockedblockedSections)),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    locationServiceMock = {
      getLocationsFeed$: jest.fn().mockReturnValue(Observable.of(mockedLocations)),
    };

    const updatedBlockedSection = {
      reason: "מרתון תל אביב'",
      from: 'A',
      to: 'B',
    };
    mapsDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(Observable.of(updatedBlockedSection)),
      }),
    };

    mswSnackbarMock = {
      displayTimedMessage: jest.fn(),
    } as Partial<MSWSnackbar>;

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
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
        {
          provide: MatDialogRef,
          useValue: {
            subscribe: () => {},
          },
        },
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

    const existingBlockedSection = {
      reason: "מרתון תל אביב'",
      from: '5c3393394287a53304b740db',
      to: '5c3393394287a53304b740d5',
    };

    fixture = TestBed.createComponent(MapsContainerComponent);
    await fixture.componentInstance.ngOnInit();
    fixture.componentInstance.addOrEditBlock(existingBlockedSection);
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
      from: '5c3393394287a53304b740db',
      to: '5c3393394287a53304b740d5',
    };
    fixture = TestBed.createComponent(MapsContainerComponent);
    await fixture.componentInstance.ngOnInit();
    fixture.componentInstance.deleteBlock(blockToDelete);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(mapsServiceMock.delete).toHaveBeenCalled();
  });

  it('should return true if the blockedSection already exists in the dataSource', async () => {
    (mapsServiceMock.getAllBlockedSections as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(mockedblockedSections);
    });

    const blockToCheck = {
      reason: "מרתון תל אביב'",
      from: '5c3393394287a53304b740db',
      to: '5c3393394287a53304b740d5',
    };

    fixture = TestBed.createComponent(MapsContainerComponent);
    await fixture.componentInstance.ngOnInit();
    const res = fixture.componentInstance.blockedSectionAlreadyExists(blockToCheck);
    expect(res).toBeTruthy();
  });

  describe('Unhappy scenarios: unexisting block', () => {
    it('should open a snackbar if trying to add a blocked section with location that does not exist', async () => {
      (mapsServiceMock.getAllBlockedSections as jest.Mock).mockImplementationOnce(() => {
        return Observable.of(mockedblockedSections);
      });
      (mapsServiceMock.create as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve(1);
      });

      const updatedBlockedSection = {
        reason: "מרתון תל אביב'",
        from: 'FF',
        to: 'B',
      };
      mapsDialogMock = {
        open: jest.fn().mockReturnValue({
          afterClosed: jest.fn().mockReturnValue(Observable.of(updatedBlockedSection)),
        }),
      };

      TestBed.configureTestingModule({
        providers: [{ provide: MatDialog, useValue: mapsDialogMock }],
      });

      fixture = TestBed.createComponent(MapsContainerComponent);
      await fixture.componentInstance.ngOnInit();
      fixture.componentInstance.addOrEditBlock();
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      expect(mapsServiceMock.create).not.toHaveBeenCalled();
      expect(mswSnackbarMock.displayTimedMessage).toHaveBeenCalledWith('אחד הקטעים החסומים אינו קיים');
    });
  });

  describe('Unhappy scenarios: duplicate block', () => {
    it('should open a snackbar if trying to add a duplicate blocked section', async () => {
      (mapsServiceMock.getAllBlockedSections as jest.Mock).mockImplementationOnce(() => {
        return Observable.of(mockedblockedSections);
      });
      (mapsServiceMock.create as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve(1);
      });

      const updatedBlockedSection = {
        reason: "מרתון תל אביב'",
        from: 'A90',
        to: 'A96',
      };
      mapsDialogMock = {
        open: jest.fn().mockReturnValue({
          afterClosed: jest.fn().mockReturnValue(Observable.of(updatedBlockedSection)),
        }),
      };

      TestBed.configureTestingModule({
        providers: [{ provide: MatDialog, useValue: mapsDialogMock }],
      });

      fixture = TestBed.createComponent(MapsContainerComponent);
      await fixture.componentInstance.ngOnInit();
      fixture.componentInstance.addOrEditBlock();
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      expect(mapsServiceMock.create).not.toHaveBeenCalled();
      expect(mswSnackbarMock.displayTimedMessage).toHaveBeenCalledWith('לא ניתן להוסיף את אותו קטע חסום');
    });
  });
});
