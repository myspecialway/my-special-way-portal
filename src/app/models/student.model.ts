import { Class } from './class.model';

export default class Student {
  _id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: Gender;
  class_id: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface StudentQuery  {
  students: Student[];
}
