import { Class } from './class.model';

export interface User {
    id: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: UserType;
    userTypeName: string;
    _class: Class;
  }

export enum UserType {
    MANAGER = 'מנהל',
    TEACHER = 'מורה',
}

export interface Query  {
    allUsers: User[];
}

// export namespace UserType {

//   export function values() {
//     return Object.keys(UserType).filter(
//       (type) => isNaN(type as any) && type !== 'values',
//     );
//   }
// }
