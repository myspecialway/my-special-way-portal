import { TimeSlot } from './timeslot.model';
export class Class {
  _id: string;
  level: string;
  number: number;
  name: string;
  schedule: TimeSlot[];
}

export interface InputClass {
  name: string;
  level: string;
  number: number;
  schedule?: TimeSlot[];
}

export interface ClassQuery  {
  classes: Class[];
  classByName: Class;
  classById: Class;
}
