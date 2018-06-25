import { isMarkerInsidePolygon } from './logic';
import { LatLng } from 'leaflet';

describe('isMarkerInsidePolygon tests', () => {
    it('should return true when point (1,1) is inside the area [(0,0), (5,0), (0,5), (5,5)]', () => {
        const testPoint = new LatLng(1, 1);
        const area = [
            new LatLng(0, 0),
            new LatLng(5, 0),
            new LatLng(0, 5),
            new LatLng(5, 5),
        ];
        expect(isMarkerInsidePolygon(testPoint, area)).toBeTruthy();
    });
    it('should return false when point (5,5) is outside the area [(0,0), (2,0), (0,2), (2,2)]', () => {
        const testPoint = new LatLng(5, 5);
        const area = [
            new LatLng(0, 0),
            new LatLng(2, 0),
            new LatLng(0, 2),
            new LatLng(2, 2),
        ];
        expect(isMarkerInsidePolygon(testPoint, area)).toBeFalsy();
    });
});
