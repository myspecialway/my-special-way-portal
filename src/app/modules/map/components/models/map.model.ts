import { Polyline } from 'leaflet';
import { LineString, MultiLineString } from 'geojson';

export interface IndoorAtlasPaths {
    nodes: IndoorAtlasNode[];
    edges: IndoorAtlasEdge[];
}

export interface IndoorAtlasNode {
    latitude: number;
    longitude: number;
    floor: number;
}

export interface IndoorAtlasEdge {
    begin: number;
    end: number;
}

export type LeafletPaths = Array<Polyline<LineString | MultiLineString>>;
