import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteBlockDialogComponent } from './dialogs/delete/delete-block.dialog';
import { AddUpdateBlockDialogComponent } from './dialogs/add-update/add-update-block.dialog';
import { MapsContainerComponent } from './maps.container.component';
import { MSWSnackbar } from '../../../services/msw-snackbar/msw-snackbar.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRow, MatRowDef, MatHeaderRowDef, MatInput, MatDialog } from '@angular/material';
import { MapProxyService } from './services/map-proxy.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommunicationService } from './services/communication.service';
import { Observable } from 'rxjs-compat';
import { MapEventType } from '../../../models/maps.file.model';
import { of } from 'rxjs/observable/of';

describe.only('MapsContainerComponent', () => {
  let fixture: ComponentFixture<MapsContainerComponent>;
  let component: MapsContainerComponent;
  let mswSnackbarMock: Partial<MSWSnackbar>;
  let mapProxyService: Partial<MapProxyService>;
  let sanitiazerMock: Partial<DomSanitizer>;
  const communicationService = new CommunicationService();
  let deleteDialogValue: Partial<MatDialog>;

  beforeEach(async () => {
    deleteDialogValue = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockImplementation(() => of({})),
      }),
    };
    sanitiazerMock = {
      sanitize: jest.fn().mockReturnValue('safeString'),
      bypassSecurityTrustResourceUrl: jest.fn().mockReturnValue('safeString'),
    };
    mapProxyService = {
      delete: jest.fn().mockReturnValue(Observable.of({})),
      read: jest
        .fn()
        .mockReturnValueOnce(Observable.of(['id-1', 'id-2']))
        .mockReturnValueOnce(
          Observable.of({
            fileName: 'file1',
            mime: 'image/jpeg',
            src: 'image buffer',
            floor: 1,
            isActive: false,
            id: 'id-1',
          }),
        )
        .mockReturnValueOnce(
          Observable.of({
            fileName: 'file2',
            mime: 'image/jpeg',
            src: 'image buffer',
            floor: 2,
            isActive: false,
            id: 'id-2',
          }),
        )
        .mockReturnValue(Observable.of({})),
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
        { provide: MatDialog, useValue: deleteDialogValue },
        { provide: CommunicationService, useValue: communicationService },
        { provide: DomSanitizer, useValue: sanitiazerMock },
        { provide: MapProxyService, useValue: mapProxyService },
        { provide: MSWSnackbar, useValue: mswSnackbarMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should match snapshot', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit event on selected map', () => {
    spyOn(communicationService.handlingMsgDataChanged, 'emit');
    component.onFloorChange({
      payload: {
        id: 'id-1',
        floor: 1,
      },
      type: MapEventType.MAP_SELECT,
    });
    fixture.detectChanges();

    expect(communicationService.handlingMsgDataChanged.emit).toHaveBeenCalledWith({
      payload: {
        id: 'id-1',
        floor: 1,
      },
      type: MapEventType.LOCATION_UPDATE,
    });
  });

  it('should emit event on delete map', () => {
    spyOn(communicationService.handlingMsgDataChanged, 'emit');
    component.onFloorChange({
      payload: {
        id: 'id-1',
        floor: 1,
      },
      type: MapEventType.MAP_DELETE,
    });
    fixture.detectChanges();
    expect(communicationService.handlingMsgDataChanged.emit).toHaveBeenCalledWith({
      payload: {
        id: 'id-1',
        next_active_id: 'id-2',
        floor: 2,
      },
      type: MapEventType.MAP_DELETE,
    });
    expect(mapProxyService.delete).toHaveBeenCalled();
  });
});
