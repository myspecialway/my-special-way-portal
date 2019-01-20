import { IDialogLocation } from './location.model';
import { Point } from './point.model';
export interface Location {
  _id: string;
  name: string;
  location_id: string;
  position: Point;
  type?: string;
  icon?: string;
  image_id: string;
}

export interface IDialogLocation {
  _id: string;
  name: string;
  location_id: string;
  position: Point;
  type?: string;
  icon?: string;
}

export const emptyMapPoint: IDialogLocation = {
  _id: '',
  name: '',
  location_id: '',
  position: {
    floor: 0,
  },
};
export interface InputLocation {
  _id: string;
  name?: string;
  location_id?: string;
  position?: Point;
  type?: string;
  icon?: string;
  image_id: string;
}

export interface LocationQuery {
  locations: Location[];
}
