import { Injectable } from '@angular/core';
import { User, UserQuery } from '../../../models/user.model';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Class, ClssQuery } from '../../../models/class.model';

@Injectable()
export class ClassService {

  classes: Observable<Class[]>;

  constructor(private apollo: Apollo) { }

  getAllClasses() {
    return this.apollo.query<ClssQuery>({
      query: gql`{
        allClasses {
          id
          level
          number
          name
        }
      }` }).toPromise();
  }

  getById(id: number) {
    return this.apollo.query<UserQuery>({
      query: gql`
        {
          Class(id:${id}) {
          id
          level
          number
          name
        }
      }
      ` }).toPromise();
  }

  create(clss: Class) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        createClass(
            id: ${clss.id}
            level:"${clss.level}"
            number: "${clss.number}"
            name: "${clss.name}"
            ) {
          id
        }
        }
    `}).toPromise();
  }

  update(clss: Class) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        updateUser(
          id: ${clss.id}
            level:"${clss.level}"
            number: "${clss.number}"
            name: "${clss.name}"
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
        removeClass(id:${id})
    }
    `}).toPromise();

  }
}
