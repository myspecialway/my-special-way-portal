import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Class, ClassQuery, InputClass } from '../../../models/class.model';
import { GetClassesResponse } from '../../../models/responses/get-classes-reponse.model';
import Student from '../../../models/student.model';
import { QUERY_GET_ALL_STUDENTS } from '../../student/services/student.graphql';
import { catchError, map } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

// TODO: refactor to using gql fragments, but know that it'll raise error related to __typename field that we configured to be emitted
// need to rethink it
const allClassFields = `
_id
name
grade
schedule {
  index
  lesson {
    title
    icon
  }
  location {
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
      .watchQuery<{ classes: Class[] }>({
        query: gql`
          {
            classes {
              _id
              grade
              name
              students {
                _id
                firstname
              }
            }
          }
        `,
      })
      .valueChanges.pipe(
        map((res) => {
          return res.data.classes;
        }),
        catchError((err: TypeError) => {
          console.warn('class.component::ngInInit:: empty stream recieved');
          return observableOf([]);
        }),
      );
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
      .toPromise()
      .then((res) => res.data.classById);
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

  create(clss: Class | Partial<Class>) {
    return this.apollo
      .mutate({
        mutation: gql`
      mutation {
        createClass(class: {
            grade: "${clss.grade}"
            name: "${clss.name}"
        }) { _id }
      }
    `,
      })
      .toPromise()
      .then((res) => {
        if (res.data) {
          return res.data.createClass;
        }
      });
  }

  update(_class: Class) {
    const { name, grade } = _class;
    const inputClass: InputClass = { name, grade };
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
      .toPromise()
      .then((res) => {
        if (res.data) {
          return res.data.updateClass;
        }
      });
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
        refetchQueries: [
          {
            query: gql`
              {
                classes {
                  _id
                  grade
                  name
                  students {
                    _id
                    firstname
                  }
                }
              }
            `,
          },
        ],
        awaitRefetchQueries: true,
      })
      .toPromise();
  }
}
