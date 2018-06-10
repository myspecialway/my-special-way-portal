import { Class } from './class.model';

  id: number;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  class: Class;
}

export enum Gender {
  MALE = 'ילד',
  FEMALE = 'ילדה',
}

export interface Query  {
  allStudents: Student[];
}

export type StudentQuery = {
  allStudents: Student[];
};