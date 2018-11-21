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
import { catchError, first } from 'rxjs/operators';
import { of as observableOf } from 'rxjs/observable/of';
import { RestorePasswordDialogComponent } from '../dialogs/restore/success/restore.dialog';
import { RestorePasswordErrorDialogComponent } from '../dialogs/restore/error/restore-error.dialog';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

@Injectable()
export class UserService {
  constructor(private apollo: Apollo, private authenticationService: AuthenticationService) {}

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

  create({ username, email, firstname, lastname, role, class: _class }: User) {
    const class_id = _class ? _class._id : undefined;
    return this.apollo
      .mutate({
        mutation: MUTATE_CREATE_USER,
        variables: {
          user: {
            username,
            email,
            firstname,
            lastname,
            role,
            class_id,
          },
        },
        refetchQueries: [{ query: QUERY_GET_ALL_USERS }],
      })
      .toPromise();
  }

  update({ _id: id, username, email, firstname, lastname, role, class: _class }: User) {
    const class_id = _class ? _class._id : undefined;
    return this.apollo
      .mutate({
        mutation: MUTATE_UPDATE_USER,
        variables: {
          id,
          user: {
            username,
            email,
            firstname,
            lastname,
            role,
            class_id,
          },
        },
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
