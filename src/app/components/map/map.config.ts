
import { latLng, tileLayer } from 'leaflet';

export const DEFAULT_POSITION = {
    latitude: 31.986422990470114,
    longtitude: 34.912109971046455,
};

export const DEFAULT_MAP_OPTIONS = {
    layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }),
    ],
    zoom: 18,
    center: latLng(DEFAULT_POSITION.latitude, DEFAULT_POSITION.longtitude),
};
