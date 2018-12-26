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
        position: {
          floor: 0,
        },
      },
      {
        _id: '5b5596a7739a882933edd509',
        name: '1 מעלית קומה',
        position: {
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
