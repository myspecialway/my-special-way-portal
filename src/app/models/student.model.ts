import { Class } from './class.model';

export default class Student {
  _id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: Gender;
  class: Class;
}

export enum Gender {
  MALE = 'זכר',
  FEMALE = 'נקבה',
}

export interface StudentQuery  {
  students: Student[];
}
