export interface IMapsFileBase {
  id: string;
  fileName: string;
  floor: number;
  isActive: boolean;
}

export interface IMapsFile extends IMapsFileBase {
  mime: string;
  src: any;
}

export enum FloorEventType {
  DELETE = 1,
  CLICK = 2,
  UPLOAD = 3,
  ERROR = 4,
}
export interface DeleteEvent {
  id: string;
  next_active_id: string;
}
export interface IFileEvent {
  payload: IMapsFileBase | DeleteEvent;
  type: FloorEventType;
}
