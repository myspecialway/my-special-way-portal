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
      ` }).toPromise(); // subscribe((x) => this.messages = x.data.message);
    // return this.users;
    // return this.http.get<User[]>('/api/users');
  }

  // getAllUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(this.API_URL);
  // }

  /*getById(id: number) {
    return this.http.get('/api/users/' + id);
  }

  create(user: User) {
    return this.http.post('/api/users', user);
  }

  update(user: User) {
    return this.http.put('/api/users/' + user.id, user);
  }

  delete(id: number) {
    return this.http.delete('/api/users/' + id);
  }
      id: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: UserType;
    _class: string;
  */
}
