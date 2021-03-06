export interface IDPayload {
  id: string;
}

export enum MapEventType {
  MAP_DELETE = 1,
  MAP_SELECT = 2,
  MAP_UPLOAD = 3,
  ERROR = 4,
  FLOOR_UPDATE_LIST = 5,
  LOCATION_UPDATE = 6,
}

export interface IMapBasePayload extends IDPayload {
  fileName: string;
  floor: number;
  isActive: boolean;
}

export interface IMapsFile extends IMapBasePayload {
  mime: string;
  src: any;
}

export interface FloorPayload extends IDPayload {
  floor: number;
}

export interface DeletePayload extends IDPayload {
  next_active_id: string;
}

export interface IFileEvent {
  payload: IMapBasePayload | DeletePayload | IDPayload | FloorPayload | IMapBasePayload[];
  type: MapEventType;
}
