import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Class, ClassQuery } from '../../../models/class.model';
import {GetClassesResponse} from "../../../models/responses/get-classes-reponse.model";

@Injectable()
export class ClassService {

  classes: Observable<Class[]>;

  constructor(private apollo: Apollo) { }

  async getAllClasses(): Promise<Class[]> {
    const getClassesResponse = await this.apollo.query({
      query: gql`{
        classes {
          _id
          level
          name
        }
      }` }).toPromise();

    return (getClassesResponse.data as GetClassesResponse).classes;
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

  delete(id: string) {
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
