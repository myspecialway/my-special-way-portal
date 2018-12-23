import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs';
import { mockedLocations } from './../../../../mocks/assets/locations.mock';
import { Apollo } from 'apollo-angular';
import { MapsService } from './services/maps.container.service';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { MapsContainerComponent } from './maps.container.component';
import { ComponentFixture, TestBed } from '../../../../../node_modules/@angular/core/testing';
import { LocationService } from '../../../services/location/location.graphql.service';
import { MatTableModule, MatDialog, MatDialogModule } from '@angular/material';

const locationServiceMock = {
  getLocations: jest.fn().mockReturnValue(Promise.resolve(mockedLocations)),
  getLocationsFeed$: jest.fn().mockReturnValue(of(mockedLocations)),
};

describe('MapsContainerComponent', () => {
  let fixture: ComponentFixture<MapsContainerComponent>;
  // let component: MapsContainerComponent;
  let watchQueryObservable: Subject<any>;

  beforeEach(async () => {
    watchQueryObservable = new Subject();
    const apolloMock = {
      watchQuery: () => ({
        valueChanges: watchQueryObservable,
      }),
    };

    TestBed.configureTestingModule({
      imports: [MatTableModule, MatDialogModule],
      declarations: [MapsContainerComponent],
      providers: [
        { provide: LocationService, useValue: locationServiceMock },
        MatDialog,
        MapsService,
        { provide: Apollo, useValue: apolloMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsContainerComponent);
    // component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
