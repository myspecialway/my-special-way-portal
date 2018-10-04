import { IUserQuery } from './../../../models/user.model';
import { Injectable } from '@angular/core';
import { User, UserQuery } from '../../../models/user.model';
import { Apollo } from 'apollo-angular';
import {
  QUERY_GET_ALL_USERS,
  QUERY_GET_USER_BY_ID,
  MUTATE_CREATE_USER,
  MUTATE_UPDATE_USER,
  MUTATE_DELETE_USER,
} from './user.graphql';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators';
import { of as observableOf } from 'rxjs/observable/of';

@Injectable()
export class UserService {
  constructor(private apollo: Apollo) {}

  getAllUsers() {
    return this.apollo
      .watchQuery<{ users: User[] }>({
        query: QUERY_GET_ALL_USERS,
      })
      .valueChanges.pipe(
        map((res: { data: { users: User[] } }) => res.data.users),
        catchError((err: TypeError) => {
          console.warn('user.component::ngInInit:: empty stream recieved');
          return observableOf([]);
        }),
      );
  }

  getById(id: number) {
    return this.apollo
      .query<UserQuery>({
        query: QUERY_GET_USER_BY_ID,
        variables: { id },
      })
      .toPromise();
  }

  create(user: User) {
    return this.apollo
      .mutate({
        mutation: MUTATE_CREATE_USER,
        variables: {
          user: {
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
          },
        },
        refetchQueries: [{ query: QUERY_GET_ALL_USERS }],
      })
      .toPromise();
  }

  update(user: User) {
    const { username, email, firstname, lastname, role, class: classData } = user;

    const userUpdate: Partial<IUserQuery> = { username, email, firstname, lastname, role };
    if (classData) {
      userUpdate.class_id = classData._id;
    }

    return this.apollo
      .mutate({
        mutation: MUTATE_UPDATE_USER,
        variables: { id: user._id, user: userUpdate },
        refetchQueries: [{ query: QUERY_GET_ALL_USERS }],
      })
      .toPromise();
  }

  delete(id: number) {
    return this.apollo
      .mutate({
        mutation: MUTATE_DELETE_USER,
        variables: { id },
        refetchQueries: [{ query: QUERY_GET_ALL_USERS }],
      })
      .toPromise();
  }
}
