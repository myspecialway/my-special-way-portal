import { Point } from './point.model';
export interface Room {
    _id: string;
    name: string;
    disabled: boolean;
    position: Point;
}
