import { Point } from './point.model';
export interface Location {
  _id: string;
  name: string;
  disabled: boolean;
  location_id: string;
  position: Point;
  type?: string;
  icon?: string;
}

export interface InputLocation {
  _id: string;
  name?: string;
  disabled?: boolean;
  location_id?: string;
  position?: Point;
  type?: string;
  icon?: string;
}

export interface LocationQuery {
  locations: Location[];
}
