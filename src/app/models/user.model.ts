import { Class } from './class.model';

export class User {
    id: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: UserType;
    userTypeName: string;
    class: Class;
  }

export enum UserType {
    MANAGER = 'מנהל',
    TEACHER = 'מורה',
}

export interface UserQuery  {
    allUsers: User[];
}

// export namespace UserType {

//   export function values() {
//     return Object.keys(UserType).filter(
//       (type) => isNaN(type as any) && type !== 'values',
//     );
//   }
// }
