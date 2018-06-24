import { Injectable } from '@angular/core';
import { UserQuery } from '../../../models/user.model';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Class, ClassQuery } from '../../../models/class.model';

@Injectable()
export class ClassService {

  classes: Observable<Class[]>;

  constructor(private apollo: Apollo) { }

  getAllClasses() {
    return this.apollo.query<ClassQuery>({
      query: gql`{
        classes {
          _id
          level
          name
        }
      }` }).toPromise();
  }

  // getById(id: number) {
  //   return this.apollo.query<UserQuery>({
  //     query: gql`
  //       {
  //         Class(id:${id}) {
  //         id
  //         level
  //         number
  //         name
  //       }
  //     }
  //     ` }).toPromise();
  // }

  create(clss: Class) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        createClass(class: {
            level: "${clss.level}"
            number:  ${clss.number}
            name: "${clss.name}"
        }) { _id }
      }
    `}).toPromise();
  }

  update(_class: Class) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        updateClass(
          id: "${_class._id}",
          class: {
            name: "${_class.name}"
            level: "${_class.level}"
            number: 1
          })
          {
            _id
          }
        }
    `}).toPromise();
  }

  delete(id: number) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        deleteClass(
          id: "${id}"
        )
    }
    `}).toPromise();
  }
}
