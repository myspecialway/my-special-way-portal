import { ComponentFixture, TestBed } from '../../../../../node_modules/@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '../../../../../node_modules/@angular/compiler/src/core';
import { MapsContainerComponent } from './maps.container.component';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs-compat';

import { MatTableModule, MatDialog } from '@angular/material';
import { MapsService } from './services/maps.container.service';
import { Apollo } from 'apollo-angular';

describe('MapsContainerComponent', () => {
  let watchQueryMockedObservable: Subject<any>;

  beforeEach(async () => {
    watchQueryMockedObservable = new Subject();
    const apolloMock = {
      watchQuery: () => ({
        valueChanges: watchQueryMockedObservable,
      }),
    };
    TestBed.configureTestingModule({
      imports: [MatTableModule],
      declarations: [MapsContainerComponent],
      providers: [
        { provide: MatDialog },
        { provide: Apollo, useValue: apolloMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ idOrNew: '_new_' }),
          },
        },
        MapsService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  let fixture: ComponentFixture<MapsContainerComponent>;
  let component: MapsContainerComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
