import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Lesson, LessonQuery } from '../../models/lesson.model';
import { FetchResult } from 'apollo-link';
import { catchError, map } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { GET_ALL_CLASSES } from '../../pages/class/services/class.graphql';
import { QUERY_GET_ALL_STUDENTS } from '../../pages/student/services/student.graphql';

const GET_ALL_LESSONS_QUERY = gql`
  {
    lessons {
      _id
      title
      icon
    }
  }
`;
const DELETE_LESSON_QUERY = (lessonId) => gql`
mutation {
  deleteLesson(
    id: "${lessonId}"
  )
}`;
const CREATE_LESSON_QUERY = (title, icon) => gql`
  mutation {
    createLesson(lesson: {
      title: "${title}"
      icon: "${icon}"
    }){ _id }
  }`;
const UPDATE_LESSON_QUERY = (lessonid, title, icon) => gql`
mutation {
  updateLesson(id: "${lessonid}", lesson: {
    title: "${title}"
    icon: "${icon}"
  }){ _id }
}`;

@Injectable()
export class LessonService {
  public create(title: string, icon: string): any {
    return this.apollo
      .mutate({
        mutation: CREATE_LESSON_QUERY(title, icon),
        refetchQueries: [
          {
            query: GET_ALL_LESSONS_QUERY,
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
  public update(lessonId: string, title: string, icon: string): any {
    return this.apollo
      .mutate({
        mutation: UPDATE_LESSON_QUERY(lessonId, title, icon),
        refetchQueries: [
          {
            query: GET_ALL_LESSONS_QUERY,
          },
          {
            query: GET_ALL_CLASSES,
          },
          {
            query: QUERY_GET_ALL_STUDENTS,
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
  constructor(private apollo: Apollo) {}
  public getAllLessons(): Observable<Lesson[]> {
    return this.apollo
      .watchQuery<{ lessons: Lesson[] }>({
        query: GET_ALL_LESSONS_QUERY,
      })
      .valueChanges.pipe(
        map((res) => {
          return res.data.lessons;
        }),
        catchError((err: TypeError) => {
          console.warn('user.component::ngInInit:: empty stream recieved');
          return observableOf([]);
        }),
      );
  }
  getLessons() {
    return this.apollo
      .query<LessonQuery>({
        query: GET_ALL_LESSONS_QUERY,
      })
      .toPromise()
      .then((res) => res.data.lessons);
  }
  public async delete(lessonId: string): Promise<FetchResult<Record<string, any>>> {
    return this.apollo
      .mutate({
        mutation: DELETE_LESSON_QUERY(lessonId),
        refetchQueries: [
          {
            query: GET_ALL_LESSONS_QUERY,
          },
          {
            query: GET_ALL_CLASSES,
          },
          {
            query: QUERY_GET_ALL_STUDENTS,
          },
        ],
        awaitRefetchQueries: true,
      })
      .toPromise();
  }
}
