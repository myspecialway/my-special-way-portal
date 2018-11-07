import { Injectable } from '@angular/core';
import { MUTATE_UPDATE_USER_PASSWORD, QUERY_GET_ALL_USERS } from '../../user/services/user.graphql';
import { Apollo } from 'apollo-angular';

@Injectable()
export class FirstloginService {
  constructor(private apollo: Apollo) {}
  updateUserPassword(id: number, password: string) {
    return this.apollo
      .mutate({
        mutation: MUTATE_UPDATE_USER_PASSWORD,
        variables: {
          id,
          password,
        },
        refetchQueries: [{ query: QUERY_GET_ALL_USERS }],
      })
      .toPromise();
  }
}
