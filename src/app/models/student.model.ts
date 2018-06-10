export type Student = {
  id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  gradeId: string;
  gender: Gender;
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export type StudentQuery = {
  allStudents: Student[];
};