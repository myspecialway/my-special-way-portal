// LOGIC THAT SHOULS SIT IN THE BE!!!
import { LatLng } from 'leaflet';

/*
Based on Ray Casting algorithm
Source: https://stackoverflow.com/questions/31790344/determine-if-a-point-reside-inside-a-leaflet-polygon
*/
export function isMarkerInsidePolygon(marker: LatLng, polyPoints: LatLng[]) {
    const x = marker.lat;
    const y = marker.lng;
    let inside = false;
    for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        const xi = polyPoints[i].lat;
        const yi = polyPoints[i].lng;
        const xj = polyPoints[j].lat;
        const yj = polyPoints[j].lng;
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }
    return inside;
}
