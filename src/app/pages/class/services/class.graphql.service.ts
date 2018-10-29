import { GET_ALL_CLASSES, QUERY_GET_CLASS_BY_ID, QUERY_GET_CLASS_BY_NAME, MUTATE_UPDATE_CLASS } from './class.graphql';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Class, ClassQuery, InputClass } from '../../../models/class.model';
import { catchError, map } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

@Injectable()
export class ClassService {
  constructor(private apollo: Apollo) {}

  getAllClasses() {
    return this.apollo
      .watchQuery<{ classes: Class[] }>({
        query: GET_ALL_CLASSES,
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
        query: QUERY_GET_CLASS_BY_ID,
        variables: { id },
      })
      .toPromise()
      .then((res) => res.data.classById);
  }
  classByName(name: string) {
    return this.apollo.query<ClassQuery>({
      query: QUERY_GET_CLASS_BY_NAME,
      variables: { name },
    });
  }
  // classByLessonTitle(title: string) {
  //   return this.apollo.query<ClassQuery>({
  //     query: QUERY_GET_CLASS_BY_LESSON_TITLE,
  //     variables: { title },
  //   });
  // }

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
        refetchQueries: [
          {
            query: GET_ALL_CLASSES,
          },
        ],
        awaitRefetchQueries: true,
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
        mutation: MUTATE_UPDATE_CLASS,
        variables: {
          id: _class._id,
          class: inputClass,
        },
        refetchQueries: [
          {
            query: QUERY_GET_CLASS_BY_ID,
            variables: { id: _class._id },
          },
          {
            query: GET_ALL_CLASSES,
          },
        ],
        awaitRefetchQueries: true,
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
            query: GET_ALL_CLASSES,
          },
        ],
        awaitRefetchQueries: true,
      })
      .toPromise();
  }
}
