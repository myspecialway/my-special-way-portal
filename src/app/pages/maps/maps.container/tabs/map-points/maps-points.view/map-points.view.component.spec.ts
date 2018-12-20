import { of } from 'rxjs/observable/of';
import { Location } from './../../../../../../models/location.model';
import { AddEditPointDialogComponent } from './../../../dialogs/add-edit-point/add-edit-point.dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
  MatDialog,
} from '@angular/material';

describe('MapPointsViewComponent', () => {
  let fixture: ComponentFixture<MapPointsViewComponent>;
  let component: MapPointsViewComponent;
  let mapPointDialogMock: Partial<MatDialog>;
  let mapPointDialogValue: Location;

  const beforeEachAsync = async () => {
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
      providers: [{ provide: MatDialog, useValue: mapPointDialogMock }],
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

    component.onEdit(testLocation);
    expect(component.update.emit).toHaveBeenLastCalledWith(mapPointDialogValue);
    // component.onLocationNameChanged(testLocation, 'test name');
    // expect(component.update.emit).toHaveBeenLastCalledWith({ _id: testLocation._id, name: 'test name' });
    // component.onLocationIdChanged(testLocation, '4');
    // expect(component.update.emit).toHaveBeenLastCalledWith({ _id: testLocation._id, location_id: '4' });
  });
});