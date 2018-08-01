import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Class, ClassQuery, InputClass } from '../../../models/class.model';

// TODO: refactor to using gql fragments, but know that it'll raise error related to __typename field that we configured to be emitted
// need to rethink it
const allClassFields = `
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
  location {
    _id
    name
    disabled
    position {
      latitude
      longitude
      floor
    }
  }
}`;
@Injectable()
export class ClassService {
  constructor(private apollo: Apollo) {}

  updateClass = gql`
    mutation updateClass($id: ID!, $class: InputClass!) {
      updateClass(id: $id, class: $class) {
        ${allClassFields}
      }
    }
  `;

  getAllClasses() {
    return this.apollo
      .query<ClassQuery>({
        query: gql`
          {
            classes {
              _id
              level
              name
            }
          }
        `,
      })
      .toPromise();
  }
  classById(id: string) {
    return this.apollo
      .query<ClassQuery>({
        query: gql`{
        classById(id: "${id}") {
          ${allClassFields}
        }
      }`,
      })
      .toPromise();
  }
  classByName(name: string) {
    return this.apollo.query<ClassQuery>({
      query: gql`{
        classByName(name: "${name}") {
          ${allClassFields}
        }
      }`,
    });
  }

  create(clss: Class) {
    return this.apollo
      .mutate({
        mutation: gql`
      mutation {
        createClass(class: {
            level: "${clss.level}"
            number:  "${clss.number}"
            name: "${clss.name}"
        }) { _id }
      }
    `,
      })
      .toPromise();
  }

  update(_class: Class) {
    const { name, level, number } = _class;
    const inputClass: InputClass = { name, level, number };
    if (_class.schedule) {
      inputClass.schedule = _class.schedule;
    }
    return this.apollo
      .mutate({
        mutation: this.updateClass,
        variables: {
          id: _class._id,
          class: inputClass,
        },
      })
      .toPromise();
  }

  delete(id: string) {
    return this.apollo
      .mutate({
        mutation: gql`
      mutation {
        deleteClass(
          id: "${id}"
        )
    }
    `,
      })
      .toPromise();
  }
}
