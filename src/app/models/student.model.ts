export default class Student {
  _id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  gradeId: string;
  gender: Gender;
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}
