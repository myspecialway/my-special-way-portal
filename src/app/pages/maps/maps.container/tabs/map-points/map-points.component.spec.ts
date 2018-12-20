import { AddEditPointDialogComponent } from './../../dialogs/add-edit-point/add-edit-point.dialog';
import { CommonModule } from '@angular/common';
import { mockedLocations } from './../../../../../../mocks/assets/locations.mock';
import { LocationService } from './../../../../../services/location/location.graphql.service';
import { MatDialogModule, MatTableModule, MatDialog } from '@angular/material';
import { MapPointsViewComponent } from './maps-points.view/map-points.view.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPointsComponent } from './map-points.component';
import { FormsModule } from '@angular/forms';

describe('MapPointsComponent', () => {
  let component: MapPointsComponent;
  let fixture: ComponentFixture<MapPointsComponent>;
  const locationServiceMock = {
    getLocations: jest.fn().mockReturnValue(Promise.resolve(mockedLocations)),
  };
  const beforeEachAsync = async () => {
    TestBed.configureTestingModule({
      imports: [MatTableModule, MatDialogModule],
      declarations: [MapPointsComponent, MapPointsViewComponent],
      providers: [{ provide: LocationService, useValue: locationServiceMock }],
    }).compileComponents();
  };

  beforeEach(beforeEachAsync);

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
