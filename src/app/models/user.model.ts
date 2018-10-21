import { Class } from './class.model';

export class User {
  _id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserType;
  class?: Class;
}

export enum UserType {
  PRINCIPLE = 'מנהל',
  TEACHER = 'מורה',
}

// this is how it is represented in DB
export enum UserRole {
  PRINCIPLE = 'PRINCIPLE',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export interface UserQuery {
  allUsers: User[];
}
