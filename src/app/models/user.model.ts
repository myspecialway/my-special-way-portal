import { Class } from './class.model';

export class User {
    _id: number;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    role: UserType;
    Class?: Class;
  }

export enum UserType {
    PRINCIPLE = 'מנהל',
    TEACHER = 'מורה',
}

export interface UserQuery  {
    allUsers: User[];
}
