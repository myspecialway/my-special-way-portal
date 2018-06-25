import { PathsMapperPipe } from './paths-mapper.pipe';
import { IndoorAtlasPaths } from './map.model';
import { polyline, latLng } from 'leaflet';

describe('pathsMapper pipe ', () => {
    let instance;
    beforeEach(() => {
        instance = new PathsMapperPipe();
    });
    it('should transform all indoor atlas paths to leaflet paths when given floor is 3', () => {
        const indoorAtlasPaths = {
            nodes: [
                { latitude: 1, longitude: 2, floor: 3 },
                { latitude: 2, longitude: 4, floor: 3 },
            ],
            edges: [
                { begin: 0, end: 1 },
            ],
        } as IndoorAtlasPaths;
        const transformed = instance.transform(indoorAtlasPaths, 3);
        expect(transformed).toEqual([polyline([latLng(1, 2), latLng(2, 4)])]);
    });

    it('should transform only indoor atlas paths that are in floor 2 to leaflet paths when given floor is 2', () => {
        const indoorAtlasPaths = {
            nodes: [
                { latitude: 1, longitude: 2, floor: 3 },
                { latitude: 2, longitude: 4, floor: 3 },
                { latitude: 80, longitude: 19, floor: 2 },
                { latitude: 88, longitude: 10, floor: 2 },
            ],
            edges: [
                { begin: 0, end: 1 },
                { begin: 2, end: 3 },
            ],
        } as IndoorAtlasPaths;
        const transformed = instance.transform(indoorAtlasPaths, 2);
        expect(transformed).toEqual([polyline([latLng(80, 19), latLng(88, 10)])]);
    });
});
