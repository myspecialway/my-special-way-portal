import { ComponentFixture, TestBed } from '../../../../../node_modules/@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '../../../../../node_modules/@angular/compiler/src/core';
import { LocationService } from '../../../services/location/location.graphql.service';

const mockedLocations = [
  {
    name: 'פטל כיתת',
    disabled: true,
    position: {
      latitude: 31.986417758011342,
      longitude: 34.91077744955874,
      floor: 0,
    },
  },
  {
    name: 'כיתת סחלב',
    disabled: false,
    position: {
      latitude: 31.986419691740092,
      longitude: 34.91078563034535,
      floor: 1,
    },
  },
  {
    name: 'כיתת קג׳בובו',
    disabled: false,
    position: {
      latitude: 31.986419691740092,
      longitude: 34.91078563034535,
      floor: 1,
    },
  },
];

const locationServiceMock = {
  getLocations: jest.fn().mockReturnValue(Promise.resolve(mockedLocations)),
};

describe('MapsContainerComponent', () => {
  let fixture: ComponentFixture<MapsContainerComponent>;
  let component: MapsContainerComponent;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MapsContainerComponent],
      providers: [{ provide: LocationService, useValue: locationServiceMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should initialize properly onInit', async () => {
    expect(component.locations).toEqual(mockedLocations);
    expect(component.currentFloorLocations).toEqual([
      {
        name: 'פטל כיתת',
        disabled: true,
        position: {
          latitude: 31.986417758011342,
          longitude: 34.91077744955874,
          floor: 0,
        },
      },
    ]);
    expect(component.availableFloors).toEqual([0, 1]);
    expect(component.currentFloor).toEqual(0);
  });

  it('should setFloor properly', async () => {
    component.setFloor(1);
    expect(component.currentFloorLocations).toEqual([
      {
        name: 'כיתת סחלב',
        disabled: false,
        position: {
          latitude: 31.986419691740092,
          longitude: 34.91078563034535,
          floor: 1,
        },
      },
      {
        name: 'כיתת קג׳בובו',
        disabled: false,
        position: {
          latitude: 31.986419691740092,
          longitude: 34.91078563034535,
          floor: 1,
        },
      },
    ]);
    expect(component.currentFloor).toEqual(1);
  });

  it('should call locationService on updateLocation', async () => {
    component.updateLocation({
      _id: '1',
      name: 'כיתת סחלב',
      disabled: false,
      position: {
        latitude: 31.986419691740092,
        longitude: 34.91078563034535,
        floor: 1,
      },
    });
    // todo: test updateLocation when implemented.
  });
});
