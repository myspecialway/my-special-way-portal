import {Injectable} from '@angular/core';
import {User, Query } from '../../../models/user.model';
import {Observable} from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

@Injectable()
export class UserService {

  users: Observable<User[]>;

  constructor(private apollo: Apollo) { }

  getAllUsers() {

    return this.apollo.query<Query>({
      query: gql`
        {
        allUsers {
          id
          userName
          firstName
          lastName
          email
          userType
        }
      }
      ` }).toPromise();
  }

  getById(id: number) {
    return true;
  }

  create(user: User) {
    return true;
  }

  update(user: User) {
    return true;
  }

  delete(id: number) {
    return true;
  }

}
