import { MapService } from './map.service';
import { Apollo } from 'apollo-angular';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

const apolloMock = {
    query: jest.fn(),
};

describe('map service tests', () => {
    let instance: MapService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MapService,
                { provide: Apollo, useValue: apolloMock },
            ],
        });
        instance = TestBed.get(MapService) as MapService;
    });
    describe('get current position', () => {
        it('should return undefined when navigator is not available', async () => {
            window.navigator['__defineGetter__']('geolocation', () => {
                return;
            });

            expect(await instance.getCurrentPosition()).not.toBeDefined();
        });
        it('should return current LatLong position when navigator geolocation is available', async () => {
            window.navigator['__defineGetter__']('geolocation', () => ({
                getCurrentPosition: (cb) => cb({ coords: { latitude: 10, longitude: 20 } }),
            }));

            expect(await instance.getCurrentPosition()).toEqual({ lat: 10, lng: 20 });
        });
    });

    describe('get all map paths', () => {
        it('should return all map paths mapped to nodes and edges', (done) => {
            apolloMock.query.mockReturnValueOnce(Observable.of({
                data: {
                    allMapPathsNodes: [],
                    allMapPathsEdges: [],
                },
            }));
            expect.assertions(1);
            instance.getAllPaths().subscribe((res) => {
                expect(res).toEqual({ nodes: [], edges: [] });
                done();
            });
        });
    });

    describe('get all available floors', () => {
        it('should return all available floors mapped to numbers', (done) => {
            apolloMock.query.mockReturnValueOnce(Observable.of({
                data: {
                    allMapFloors: [{ floor: 1 }, { floor: 23 }],
                },
            }));
            expect.assertions(1);
            instance.getAllAvailableFloors().subscribe((res) => {
                expect(res).toEqual([1, 23]);
                done();
            });
        });
    });
    describe('get all map waypoints', () => {
        it('should return all map waypoints mapped to leaflet features', (done) => {
            apolloMock.query.mockReturnValueOnce(Observable.of({
                data: {
                    allMapWayPoints: [{
                        name: 'room1',
                        disabled: false,
                        position: { latitude: 1, longitude: 22, floor: 1 },
                    }],
                },
            }));
            expect.assertions(1);
            instance.getAllMapWayPoints().subscribe((res) => {
                expect(res).toEqual({
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: {
                            name: 'room1',
                            disabled: false,
                            floor: 1,
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [22, 1],
                        },
                    }],
                });
                done();
            });
        });
    });
});
