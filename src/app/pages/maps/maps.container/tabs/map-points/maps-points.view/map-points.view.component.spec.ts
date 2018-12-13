import { mockedLocations } from './../../../../../../../mocks/assets/locations.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapPointsViewComponent } from './map-points.view.component';
import {
  MatListModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTableModule,
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatGridListModule,
  MatDialogModule,
} from '@angular/material';

describe('ClassDetailsComponent with class info', () => {
  let fixture: ComponentFixture<MapPointsViewComponent>;
  let component: MapPointsViewComponent;
  const beforeEachAsync = async () => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonToggleModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatTableModule,
        MatGridListModule,
        MatSlideToggleModule,
        MatListModule,
      ],
      // providers: [MatDialog],
      declarations: [MapPointsViewComponent],
    }).compileComponents();
  };
  beforeEach(beforeEachAsync);

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPointsViewComponent);
    component = fixture.componentInstance;
    component.locations = mockedLocations;
    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should update Location', () => {
    component.update.emit = jest.fn();

    const testLocation = {
      _id: '3',
      name: 'כיתת קג׳בו',
      disabled: false,
      location_id: '3',
      position: {
        latitude: 31.986419691740092,
        longitude: 34.91078563034535,
        floor: 1,
      },
    };

    component.onUpdate(testLocation, { name: 'new location name' });
    expect(component.update.emit).toHaveBeenLastCalledWith({
      _id: '3',
      name: 'new location name',
      disabled: false,
      location_id: '3',
      position: {
        latitude: 31.986419691740092,
        longitude: 34.91078563034535,
        floor: 1,
      },
    });
    // component.onLocationNameChanged(testLocation, 'test name');
    // expect(component.update.emit).toHaveBeenLastCalledWith({ _id: testLocation._id, name: 'test name' });
    // component.onLocationIdChanged(testLocation, '4');
    // expect(component.update.emit).toHaveBeenLastCalledWith({ _id: testLocation._id, location_id: '4' });
  });
});