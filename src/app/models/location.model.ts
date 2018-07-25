import { Point } from './point.model';
export interface Location {
    _id: string;
    name: string;
    disabled: boolean;
    position: Point;
}

export interface LocationQuery {
    locations: Location[];
}
