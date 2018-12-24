import { LocationService } from './../../../../../services/location/location.graphql.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapFloorListComponent } from './map-floor-list.component';

describe('MapFloorListComponent', () => {
  let locationServiceMock: Partial<LocationService>;
  let component: MapFloorListComponent;
  let fixture: ComponentFixture<MapFloorListComponent>;
  beforeEach(async(() => {
    const mockedLocations = [
      {
        _id: '5b5596a7739a882933edd508',
        name: '0 מעלית קומה',
        disabled: false,
        position: {
          latitude: 31.986560512840278,
          longitude: 34.910118203021,
          floor: 0,
        },
      },
      {
        _id: '5b5596a7739a882933edd509',
        name: '1 מעלית קומה',
        disabled: false,
        position: {
          latitude: 31.98645927637093,
          longitude: 34.910666137884625,
          floor: 1,
        },
      },
    ];
    locationServiceMock = {
      getLocations: jest.fn().mockReturnValue(Promise.resolve(mockedLocations)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: LocationService, useValue: locationServiceMock }],
      declarations: [MapFloorListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFloorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
