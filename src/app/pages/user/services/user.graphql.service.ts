import { Injectable } from '@angular/core';
import { User, UserQuery } from '../../../models/user.model';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class UserService {

  users: Observable<User[]>;

  constructor(private apollo: Apollo) { }

  getAllUsers() {
    return this.apollo.query<UserQuery>({
      query: gql`
        {
         users {
          _id
          username
          firstname
          lastname
          email
          role
        }
      }
      ` }).toPromise();
  }

  getById(id: number) {
    return this.apollo.query<UserQuery>({
      query: gql`
        {
          User(id:${id}) {
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

  create(user: User) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        createUser(user: {
          username: "${user.username}",
          email: "${user.email}"
          firstname: "${user.firstname}"
          lastname: "${user.lastname}"
          role: ${user.role}
        }) { _id }
      }
    `}).toPromise();
  }

  update(user: User) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        updateUser(
            id: "${user._id}",
            user: {
              username: "${user.username}"
              email: "${user.email}"
              firstname:"${user.firstname}"
              lastname: "${user.lastname}"
               }
            ) {
          _id
        }
        }
    `}).toPromise();
  }

  delete(id: number) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        deleteUser(
          id: "${id}"
        )
    }
    `}).toPromise();
  }
}
