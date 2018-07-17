import { Injectable } from '@angular/core';
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
  classById(id: string) {
    return this.apollo.query<ClassQuery>({
      query: gql`{
        classById(id: "${id}") {
          _id
          name
          level
          number
          schedule {
            index
            lesson {
              _id
              title
              icon
            }
          }
        }
      }`,
    }).toPromise();
  }
  classByName(name: string) {
    return this.apollo.query<ClassQuery>({
      query: gql`{
        classByName(name: "${name}") {
          _id
          name
          level
          number
          schedule {
            index
            lesson {
              _id
              title
              icon
            }
          }
        }
      }`,
    });
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
