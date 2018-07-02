import { TestBed } from '@angular/core/testing';
import { MapComponent, PathsMapperPipe } from './index';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MapService } from './map.service';
import { Observable } from 'rxjs/Observable';

const mapMock = {
    getAllPaths: () => Observable.of({nodes: [], edges: []}),
    getAllAvailableFloors: () => Observable.of([2, 3 ]),
    getAllMapWayPoints: () => Observable.of([]),
    getCurrentPosition: () => Promise.resolve(),
};

describe('map component', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [
                MapComponent,
                PathsMapperPipe,
            ],
            providers: [
                {provide: MapService, useValue: mapMock},
            ],
            schemas: [NO_ERRORS_SCHEMA],
          });
    });

    it('should render the map component correctly', () => {
        const fixture = TestBed.createComponent(MapComponent);
        expect(fixture).toMatchSnapshot();
    });

    // it('should display paths from floor 2 when clicking on floor 2 button', () => {
    //     const fixture = TestBed.createComponent(MapComponent);
    //     const floor3Button = fixture.debugElement.query(By.css('button'));
    //     floor3Button.click();

    //     // this isn't the best way to test it, I need to figure out a better way
    //     expect(fixture.componentInstance.currentFloor).toEqual(2);
    // });
});
