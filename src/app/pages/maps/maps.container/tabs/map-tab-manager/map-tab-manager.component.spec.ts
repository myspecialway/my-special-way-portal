import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTabManagerComponent } from './map-tab-manager.component';

describe('MapTabManagerComponent', () => {
  let component: MapTabManagerComponent;
  let fixture: ComponentFixture<MapTabManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapTabManagerComponent],
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
});

// import { mockedLocations } from './../../../../../../mocks/assets/locations.mock';
// import { LocationService } from './../../../../../services/location/location.graphql.service';
// import { MatDialogModule, MatTableModule, MatDialog } from '@angular/material';
// import { MapPointsViewComponent } from './maps-points.view/map-points.view.component';
// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { MapPointsComponent } from './map-points.component';
// import { Location } from '../../../../../models/location.model';

// describe('MapPointsComponent', () => {
//   let component: MapPointsComponent;
//   let fixture: ComponentFixture<MapPointsComponent>;
//   const locationServiceMock = {
//     getLocations: jest.fn().mockReturnValue(Promise.resolve(mockedLocations)),
//     create: jest.fn(),
//     update: jest.fn(),
//     delete: jest.fn(),
//   };
//   let mapPointsDialogMock: Partial<MatDialog>;

//   const beforeEachAsync = async () => {
//     mapPointsDialogMock = {
//       open: jest.fn().mockReturnValue({
//         afterClosed: jest.fn(),
//       }),
//     };

//     TestBed.configureTestingModule({
//       imports: [MatTableModule, MatDialogModule],
//       declarations: [MapPointsComponent, MapPointsViewComponent],
//       providers: [
//         { provide: LocationService, useValue: locationServiceMock },
//         { provide: MatDialog, useValue: mapPointsDialogMock },
//       ],
//     }).compileComponents();
//   };

//   beforeEach(beforeEachAsync);

//   beforeEach(() => {
//     fixture = TestBed.createComponent(MapPointsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should create point on user onUpdate request, without _id', () => {
//     const point = { ...mockedLocations[0], _id: undefined };
//     component.onUpdate((point as any) as Location);

//     expect(locationServiceMock.create).toBeCalledWith(point);
//   });

//   it('should update point on user onUpdate request, with _id', () => {
//     const point = { ...mockedLocations[0] };
//     component.onUpdate(point);

//     expect(locationServiceMock.update).toBeCalledWith(point);
//   });

//   it.skip('should delete point when user confirms delete dialog', () => {
//     // const closedResponse = true;
//     // const afterClosedValue = of(closedResponse);

//     const point = { ...mockedLocations[0] };
//     component.onDelete(point);

//     expect(locationServiceMock.delete).toBeCalled();
//     expect(locationServiceMock.delete).toBeCalledWith(point._id);
//   });

//   it.skip('should NOT delete point on user cancels delete dialog ', () => {
//     // const closedResponse = false;
//     const point = { ...mockedLocations[0] };
//     component.onDelete(point);

//     expect(locationServiceMock.delete).not.toBeCalled();
//   });
// });
