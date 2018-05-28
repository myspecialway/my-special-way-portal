export default class User {
  _id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  grade_id: string;
}

export enum UserType {
  MANAGERE = 'Manager',
  TEACHER = 'Teacher'
}
