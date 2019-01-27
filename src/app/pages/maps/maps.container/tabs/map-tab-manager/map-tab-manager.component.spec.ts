import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTabManagerComponent } from './map-tab-manager.component';
import { CommunicationService } from '../../services/communication.service';
import { LocationService } from '../../../../../services/location/location.graphql.service';
import {
  MatTabsModule,
  MatButtonToggleModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatGridListModule,
  MatTableModule,
  MatListModule,
} from '@angular/material';
import { MapPointsViewComponent } from '../map-points/map-points.view.component';
import { MapBlockSectionComponent } from '../map-block-section/map-block-section.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MSWSnackbar } from '../../../../../services/msw-snackbar/msw-snackbar.service';
import { MapEventType } from '../../../../../models/maps.file.model';
import { Observable } from 'rxjs-compat';
import { mockedLocationsReal } from '../../../../../../mocks/assets/loocations.mock.real';

describe('MapTabManagerComponent', () => {
  let component: MapTabManagerComponent;
  let fixture: ComponentFixture<MapTabManagerComponent>;
  const communicationService = new CommunicationService();
  let locationServiceMock: Partial<LocationService>;
  let mswSnackbarMock: Partial<MSWSnackbar>;

  beforeEach(async(() => {
    locationServiceMock = {
      getLocationByMapId$: jest.fn().mockReturnValue(Observable.of(mockedLocationsReal)),
    };
    mswSnackbarMock = {
      displayTimedMessage: jest.fn(),
    } as Partial<MSWSnackbar>;

    TestBed.configureTestingModule({
      providers: [
        { provide: MSWSnackbar, useValue: mswSnackbarMock },
        { provide: CommunicationService, useValue: communicationService },
        { provide: LocationService, useValue: locationServiceMock },
      ],
      declarations: [MapTabManagerComponent, MapPointsViewComponent, MapBlockSectionComponent],
      imports: [
        MatTabsModule,
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
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTabManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update locations floor and image id', () => {
    component.currentLocations = [];
    component.imageId = 'blbalba';
    component.onParantChange({
      payload: { id: 'blbalba', next_active_id: 'next', floor: 1 },
      type: MapEventType.MAP_DELETE,
    });
    fixture.detectChanges();
    expect(component.imageId).toEqual('next');
    expect(component.floor).toEqual(1);
    expect(locationServiceMock.getLocationByMapId$).toBeCalled();
  });

  it('should show only the current floor locations', () => {
    component.currentLocations = [];
    component.imageId = 'before';
    component.onParantChange({
      payload: { id: 'after', floor: 2 },
      type: MapEventType.MAP_UPLOAD,
    });
    fixture.detectChanges();
    expect(component.imageId).toEqual('after');
    expect(component.floor).toEqual(2);
    expect(locationServiceMock.getLocationByMapId$).toBeCalled();
  });
});
