export interface IMapBasePayload  extends IDPayload  {
  fileName: string;
  floor: number;
  isActive: boolean;
}

export interface IMapsFile extends IMapBasePayload {
  mime: string;
  src: any;
}

export enum FloorEventType {
  DELETE = 1,
  SELECT = 2,
  UPLOAD = 3,
  ERROR = 4,
  UPDATE_LIST = 5,
}
export interface IDPayload {
  id: string,
}
export interface DeletePayload extends IDPayload {
  next_active_id: string;
}
export interface IFileEvent {
  payload: IMapBasePayload | DeletePayload | IDPayload | IMapBasePayload[];
  type: FloorEventType;
}
