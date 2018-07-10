import { IndoorAtlasNode, IndoorAtlasEdge } from '../models/map.model';

export interface AllPathsResponse {
    allMapPathsNodes: IndoorAtlasNode[];
    allMapPathsEdges: IndoorAtlasEdge[];
}

export interface MapFloorsResponse {
    allMapFloors: Array<{floor: number}>;
}

export interface MapPOI {
    name: string;
        disabled: boolean;
        position: { latitude: number, longitude: number, floor: number };
}
export interface MapPOIsResponse {
    allMapPOIs: MapPOI[];
}
export interface POIsProps {
    name: string;
    disabled: boolean;
    floor: number;
}
