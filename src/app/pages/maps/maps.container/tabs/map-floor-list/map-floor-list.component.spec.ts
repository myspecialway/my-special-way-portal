import { MAP_FLOOR_MAPS } from './../../../maps-constants';
import { Location } from './../../../../../models/location.model';
import { mockedLocations } from './../../../../../../mocks/assets/locations.mock';
import { LocationService } from './../../../../../services/location/location.graphql.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapFloorListComponent } from './map-floor-list.component';

describe('MapFloorListComponent', () => {
  let locationServiceMock: Partial<LocationService>;
  let component: MapFloorListComponent;
  let fixture: ComponentFixture<MapFloorListComponent>;
  beforeEach(async(() => {
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

  it('should update floors when locations are set', () => {
    component.updateFloors = jest.fn();
    const locationsMock = [...mockedLocations];
    component.locations = locationsMock;
    expect(component.updateFloors).toBeCalledWith(locationsMock);
  });

  it('should update floors with empty array when locations are set to undefined', () => {
    component.updateFloors = jest.fn();
    component.locations = (undefined as any) as Location[];
    expect(component.updateFloors).toBeCalledWith([]);
  });

  it('should update floors with sorted location items', () => {
    const locationsMock = [...mockedLocations];
    component.locations = locationsMock;
    const expected = [...MAP_FLOOR_MAPS.filter(({ index }) => [0, 1].includes(index))];
    expect(component.floors).toEqual(expected);
  });
});
