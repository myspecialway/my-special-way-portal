import { latLng, tileLayer, geoJSON, circleMarker } from 'leaflet';
import { WaypointsProps } from './map.service';
import { Point, FeatureCollection } from 'geojson';

export const DEFAULT_POSITION = {
    latitude: 31.986326703711, longitude: 34.91069670359139,
};

const geojsonMarkerOptions = {
    radius: 5,
    fillColor: '#ff7800',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
};

export const WAYPOINTS_LAYER = geoJSON({
    type: 'FeatureCollection',
    features: [],
} as FeatureCollection<Point, WaypointsProps>, {
    pointToLayer: (feature, latlng) => {
        return circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: (feature, layer) => {
        const {name, disabled, floor} = feature.properties as WaypointsProps;
        layer.bindPopup(`${name} - ${disabled} - ${floor}`);
    },
});

export const DEFAULT_MAP_OPTIONS = {
    layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }),
        WAYPOINTS_LAYER,
    ],
    zoom: 19,
    center: latLng(DEFAULT_POSITION.latitude, DEFAULT_POSITION.longitude),
};
