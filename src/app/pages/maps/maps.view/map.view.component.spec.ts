import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapViewComponent } from './map.view.component';
import { MatListModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';

const mockedLocations = [
  {
    _id: '0',
    name: 'פטל כיתת',
    disabled: true,
    location_id: '0',
    position: {
      latitude: 31.986417758011342,
      longitude: 34.91077744955874,
      floor: 0,
    },
  },
  {
    _id: '1',
    name: 'כיתת סחלב',
    disabled: false,
    location_id: '1',
    position: {
      latitude: 31.986419691740092,
      longitude: 34.91078563034535,
      floor: 1,
    },
  },
  {
    _id: '3',
    name: 'כיתת קג׳בובו',
    disabled: false,
    location_id: '2',
    position: {
      latitude: 31.986419691740092,
      longitude: 34.91078563034535,
      floor: 1,
    },
  },
];

const beforeEachAsync = async () => {
  TestBed.configureTestingModule({
    imports: [MatSlideToggleModule, MatSelectModule, MatListModule],
    declarations: [MapViewComponent],
  }).compileComponents();
};

describe('ClassDetailsComponent with class info', () => {
  let fixture: ComponentFixture<MapViewComponent>;
  let component: MapViewComponent;
  beforeEach(beforeEachAsync);

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    component.floor = 0;
    component.availableFloors = [0, 1];
    component.locations = mockedLocations;
    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should update Location', () => {
    component.updateLocation.emit = jest.fn();
    component.onLocationDisabledChanged(
      {
        _id: '3',
        name: 'כיתת קג׳בובו',
        disabled: false,
        location_id: '3',
        position: {
          latitude: 31.986419691740092,
          longitude: 34.91078563034535,
          floor: 1,
        },
      },
      true,
    );
    expect(component.updateLocation.emit).toHaveBeenCalled();
    component.onLocationNameChanged(
      {
        _id: '3',
        name: 'כיתת קג׳בו',
        disabled: false,
        location_id: '3',
        position: {
          latitude: 31.986419691740092,
          longitude: 34.91078563034535,
          floor: 1,
        },
      },
      'test name',
    );
    expect(component.updateLocation.emit).toHaveBeenCalled();
    // todo: further test the location update when implemented.
  });
});
