import { IDialogLocation } from './location.model';
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
}

export const emptyMapPoint: IDialogLocation = {
  _id: '',
  name: '',
  disabled: false,
  location_id: '',
  position: {
    latitude: 0,
    longitude: 0,
    floor: 0,
  },
};
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
