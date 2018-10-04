import { Class } from './class.model';

interface IBaseUser {
  _id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserType;
}

export interface IUserQuery extends IBaseUser {
  class_id?: string;
  class: undefined;
}

export class User implements IBaseUser {
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
  STUDENT = 'תלמיד',
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
