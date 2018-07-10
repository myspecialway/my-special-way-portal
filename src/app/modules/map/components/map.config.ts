import { latLng, tileLayer, geoJSON, circleMarker } from 'leaflet';
import { POIsProps } from './services';
import { Point, FeatureCollection } from 'geojson';

const defaultPosition = {
    latitude: 31.986326703711, longitude: 34.91069670359139,
};

const geojsonMarkerOptions = {
    radius: 3,
    fillColor: '#ff7800',
    color: '#333',
    weight: 1,
    opacity: 0.9,
    fillOpacity: 0.6,
};

const pointsOfInterestLayer = geoJSON({
    type: 'FeatureCollection',
    features: [],
} as FeatureCollection<Point, POIsProps>, {
    pointToLayer: (feature, latlng) => {
        return circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: (feature, layer) => {
        const {name, disabled, floor} = feature.properties as POIsProps;
        layer.bindPopup(`${name} - ${disabled} - ${floor}`);
    },
});

const defaultMapOptions = {
    layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
        }),
        pointsOfInterestLayer,
    ],
    zoom: 18,
    center: latLng(defaultPosition.latitude, defaultPosition.longitude),
};

export {defaultMapOptions, pointsOfInterestLayer, defaultPosition};
