import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { DeleteBlockDialogComponent } from './dialogs/delete/delete-block.dialog';
import { AddUpdateBlockDialogComponent } from './dialogs/add-update/add-update-block.dialog';
import { MapsService } from './services/maps.container.service';
import { MapsContainerComponent } from './maps.container.component';
import { MatHeaderRow, MatHeaderRowDef, MatInput, MatRowDef } from '@angular/material';
import { ClassComponent } from './class.component';
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
import { MatHeaderRow, MatRowDef, MatHeaderRowDef, MatSort, MatDialog } from '@angular/material';

describe('MapsContainerComponent', () => {
  let fixture: ComponentFixture<MapsContainerComponent>;
  let component: MapsContainerComponent;
  let mapsServiceMock: Partial<MapsService>;
  let mapsDialogMock: Partial<MatDialog>;
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
    fixture = TestBed.createComponent(MapsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should load correct number of blocked sections ', async () => {
    (mapsServiceMock.getAllBlockedSections as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(mockedblockedSections);
    });

    expect(fixture.componentInstance.dataSource.data.length).toEqual(1);
  });

  it('should call mapsServiceMock.create when calling add new blocked section ', async () => {
    (mapsServiceMock.getAllBlockedSections as jest.Mock).mockImplementationOnce(() => {
      return Observable.of(mockedblockedSections);
    });
    (mapsServiceMock.create as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(1);
    });
    const newBlockedSection = {
      reason: 'New reason',
      from: 'B',
      to: 'D',
    };
    fixture.componentInstance.addOrEditBlock(newBlockedSection);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(mapsServiceMock.create).toHaveBeenCalled();
  });
});
