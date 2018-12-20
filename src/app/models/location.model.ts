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

export interface IDialogLocation {
  _id: string;
  name: string;
  disabled: boolean;
  location_id: string;
  position: Point;
  type?: string;
  icon?: string;
  isNewPoint?: boolean;
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
