import { TimeSlot } from './timeslot.model';
export class Class {
  _id: string;
  name: string;
  grade: string;
  schedule: TimeSlot[];
}

export interface InputClass {
  name: string;
  grade: string;
  schedule?: TimeSlot[];
}

export interface ClassQuery {
  classes: Class[];
  classByName: Class;
  classById: Class;
}
