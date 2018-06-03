export default class User {
    id: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: UserType;
    _class: string;
  }

  export enum UserType {
    MANAGER = 'מנהל',
    TEACHER = 'מורה'
}

export namespace UserType {

  export function values() {
    return Object.keys(UserType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
