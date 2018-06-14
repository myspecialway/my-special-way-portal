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
         allUsers {
          id
          userName
          firstName
          lastName
          email
          userType
          Class {
            name
            id
          }
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
        createUser(
            id: ${user.id}
            userName:"${user.userName}"
            firstName:"${user.firstName}"
            lastName: "${user.lastName}"
            email: "${user.email}"
            userType: "${user.userType}"
            class_id: "${user.Class && user.Class.id}"
            ) {
          id
        }
        }
    `}).toPromise();
  }

  update(user: User) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        updateUser(
            id: "${user.id}"
            userName: "${user.userName}"
            firstName:"${user.firstName}"
            lastName: "${user.lastName}"
            email: "${user.email}"
            userType: "${user.userType}"
            class_id: "${user.Class && user.Class.id}"
            ) {
          id
        }
        }
    `}).toPromise();
  }

  delete(id: number) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        removeUser(id:${id})
    }
    `}).toPromise();

  }
}
