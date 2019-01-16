export interface IMapsFileBase {
  id: string;
  fileName: string;
  floor: number;
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
export interface ID {
  id: string;
}
export interface IFileEvent {
  payload: IMapsFileBase | ID;
  type: FloorEventType;
}
