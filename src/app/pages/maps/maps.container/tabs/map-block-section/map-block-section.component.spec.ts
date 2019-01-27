import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';

import { MapBlockSectionComponent } from './map-block-section.component';
import {
  MatButtonToggleModule,
  MatButtonModule,
  MatInputModule,
  MatDialogModule,
  MatTableModule,
  MatSelectModule,
  MatListModule,
  MatGridListModule,
  MatDialog,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MSWSnackbar } from '../../../../../services/msw-snackbar/msw-snackbar.service';
import { BlockedSectionsService } from '../../services/blocked.sections.service';
import BlockedSection from '../../../../../models/blocked-section.model';
import { mockedBlockReal, mockedLocationsReal } from '../../../../../../mocks/assets/loocations.mock.real';
import { Observable } from 'rxjs-compat';
describe('MapBlockSectionComponent', () => {
  let component: MapBlockSectionComponent;
  let fixture: ComponentFixture<MapBlockSectionComponent>;
  let mswSnackbarMock: Partial<MSWSnackbar>;
  let blockedSectionsService: Partial<BlockedSectionsService>;
  let blockSectionDialogValue: BlockedSection;
  let BlockedSectionDialogMock: Partial<MatDialog>;

  beforeEach(async(() => {
    blockedSectionsService = {
      getBlockSectionsByLocations: jest.fn().mockReturnValue(Observable.of(mockedBlockReal)),
      delete: jest.fn().mockReturnValue(Promise.resolve({ data: 'success' })),
      create: jest.fn().mockReturnValue(Promise.resolve({ data: 'success' })),
      update: jest.fn().mockReturnValue(Promise.resolve('id-blblasblabd')),
    };
    mswSnackbarMock = {
      displayTimedMessage: jest.fn(),
    } as Partial<MSWSnackbar>;

    blockSectionDialogValue = { ...mockedBlockReal[0] };
    BlockedSectionDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockImplementation(() => of(blockSectionDialogValue)),
      }),
    };
    TestBed.configureTestingModule({
      imports: [
        MatButtonToggleModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatTableModule,
        MatGridListModule,
        MatListModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MSWSnackbar, useValue: mswSnackbarMock },
        { provide: MatDialog, useValue: BlockedSectionDialogMock },
        { provide: BlockedSectionsService, useValue: blockedSectionsService },
      ],
    });
    TestBed.configureTestingModule({
      declarations: [MapBlockSectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBlockSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show only the block that belong to this locations blocked', () => {
    component.blockFloor = 1;
    component.availableLocations = mockedLocationsReal;
    fixture.detectChanges();
    expect(component.dataSource.data).toEqual(mockedBlockReal);
  });

  it('should delete blocked section if exist', () => {
    component.blockFloor = 1;
    component.availableLocations = mockedLocationsReal;
    component.deleteBlock({
      _id: '5c4da4574302182cccae3519',
      reason: 'D18',
      from: '5c4d6f900a39312330403245',
      to: '5c4d6f900a3931233040325c',
    });
    fixture.detectChanges();
    expect(blockedSectionsService.delete).toBeCalled();
  });

  it('should not delete blocked section if exist', () => {
    component.blockFloor = 1;
    component.availableLocations = mockedLocationsReal;
    component.deleteBlock({
      _id: '5c4da4574302182cccae3519',
      reason: 'D18',
      from: 'not exsit',
      to: '5c4d6f900a3931233040325c',
    });
    fixture.detectChanges();
    expect(blockedSectionsService.delete).not.toBeCalled();
  });

  it('should update blocked section', () => {
    component.blockFloor = 1;
    component.availableLocations = mockedLocationsReal;
    component.addOrEditBlock({
      _id: '5c4da4574302182cccae3519',
      reason: 'D18',
      from: '5c4d6f900a39312330403245',
      to: '5c4d6f900a3931233040325c',
    });
    fixture.detectChanges();
    expect(blockedSectionsService.update).toBeCalled();
  });

  it('should create blocked section', () => {
    component.blockFloor = 1;
    component.availableLocations = mockedLocationsReal;
    component.addOrEditBlock();
    fixture.detectChanges();
    expect(blockedSectionsService.create).toBeCalled();
  });
});
