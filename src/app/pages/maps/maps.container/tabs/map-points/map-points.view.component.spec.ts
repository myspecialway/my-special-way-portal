import { of } from 'rxjs/observable/of';
import { Location } from '../../../../../models/location.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockedLocations } from '../../../../../../mocks/assets/locations.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatListModule,
  MatSelectModule,
  MatTableModule,
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatGridListModule,
  MatDialogModule,
  MatDialog,
} from '@angular/material';
import { MapPointsViewComponent } from './map-points.view.component';
import { LocationService } from '../../../../../services/location/location.graphql.service';
import { MSWSnackbar } from '../../../../../services/msw-snackbar/msw-snackbar.service';

describe('MapPointsViewComponent', () => {
  let fixture: ComponentFixture<MapPointsViewComponent>;
  let component: MapPointsViewComponent;
  let mswSnackbarMock: Partial<MSWSnackbar>;
  let locationServiceMock: Partial<LocationService>;
  let mapPointDialogMock: Partial<MatDialog>;
  let mapPointDialogValue: Location;

  const beforeEachAsync = async () => {
    locationServiceMock = {
      delete: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };
    mswSnackbarMock = {
      displayTimedMessage: jest.fn(),
    } as Partial<MSWSnackbar>;

    mapPointDialogValue = { ...mockedLocations[0] };
    mapPointDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockImplementation(() => of(mapPointDialogValue)),
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
        { provide: LocationService, useValue: locationServiceMock },
        { provide: MatDialog, useValue: mapPointDialogMock },
      ],
      declarations: [MapPointsViewComponent],
    }).compileComponents();
  };
  beforeEach(beforeEachAsync);

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPointsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should match snapshot', () => {
  //     expect(fixture).toMatchSnapshot();
  // });

  it('should show only the current floor locations', () => {
    component.pointFloor = 1;
    component.locations = mockedLocations;
    fixture.detectChanges();

    expect(component._locations).toEqual([
      {
        _id: '1',
        name: 'כיתת סחלב',
        location_id: '1',
        position: {
          floor: 1,
        },
        image_id: '2',
      },
      {
        _id: '3',
        name: 'כיתת קג׳בובו',
        location_id: '2',
        position: {
          floor: 1,
        },
        image_id: '3',
      },
    ]);
  });

  it('should create new location', () => {
    component.pointFloor = 1;
    component.locations = mockedLocations;
    fixture.detectChanges();
    component.onLocationUpdate({
      name: 'כיתת קג׳בובו',
      location_id: '4',
      position: {
        floor: 4,
      },
      image_id: '4',
    });
    expect(locationServiceMock.create).toBeCalled();
  });

  it('should update  location', () => {
    component.pointFloor = 1;
    component.locations = mockedLocations;
    fixture.detectChanges();
    component.onLocationUpdate({
      _id: '0',
      image_id: '1',
      name: 'עבר עידכון',
      location_id: '3',
      position: {
        floor: 3,
      },
    });
    expect(locationServiceMock.update).toBeCalled();
  });

  it('should not update location because this point is already exsit', () => {
    component.pointFloor = 1;
    component.locations = mockedLocations;
    fixture.detectChanges();
    component.onLocationUpdate({
      _id: '2',
      name: 'ggכיתת סחלב',
      location_id: '1',
      position: {
        floor: 1,
      },
      image_id: '2',
    });
    expect(mswSnackbarMock.displayTimedMessage).toBeCalled();
  });

  it('should update location', () => {
    component.pointFloor = 1;
    component.locations = mockedLocations;
    fixture.detectChanges();
    component.onLocationUpdate({
      _id: '1',
      name: 'ggss333כיתת סחלב',
      location_id: '1',
      position: {
        floor: 1,
      },
      image_id: '3',
    });
    expect(mswSnackbarMock.displayTimedMessage).not.toBeCalled();
  });

  it('should create new location', () => {
    component.pointImageId = '1';
    component.pointFloor = 1;
    component.locations = mockedLocations;
    component.onLocationDelete({
      _id: '0',
      name: 'פטל כיתת',
      location_id: '0',
      position: {
        floor: 0,
      },
      image_id: '1',
    });
    fixture.detectChanges();
    expect(locationServiceMock.delete).toBeCalled();
  });
});
