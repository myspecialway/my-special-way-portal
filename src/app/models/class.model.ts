import { TimeSlot } from './timeslot.model';
export class Class {
  _id: string;
  name: string;
  grade: string;
  schedule: TimeSlot[];

  constructor() {
    this._id = '';
    this.name = '';
    this.grade = '';
    this.schedule = [];
  }
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
