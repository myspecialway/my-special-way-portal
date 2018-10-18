export interface Label {
  _id: string;
  index?: number;
  type: LabelType;
  text: string;
}

export enum LabelType {
  CLASS_HOURS = 'CLASS_HOURS',
}

export interface LabelQuery {
  labels: Label[];
  labelsByType: Label[];
}
