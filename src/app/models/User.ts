export default class User {
  id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  // grade: Grade;
}

export enum UserType {
  MANAGERE = 'Manager',
  TEACHER = 'Teacher'
}
