import { IReminders } from './reminder.model';
import { Class } from './class.model';
import { TimeSlot } from './timeslot.model';

export default class Student {
  _id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: Gender;
  class: Class;
  schedule: TimeSlot[];
  reminders: IReminders;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface StudentQuery {
  _id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: Gender;
  class_id: string;
  schedule?: TimeSlot[];
  reminders?: IReminders;
}

export interface StudentsQuery {
  students: Student[];
}
