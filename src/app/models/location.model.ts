import { Point } from './point.model';
export interface Location {
    _id: string;
    name: string;
    enabled: boolean;
    position: Point;
}
