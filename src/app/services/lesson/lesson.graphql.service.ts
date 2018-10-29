import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { LessonQuery, Lesson } from '../../models/lesson.model';
import { FetchResult } from 'apollo-link';
import { catchError, map } from 'rxjs/operators';
import { of as observableOf, Observable } from 'rxjs';

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

@Injectable()
export class LessonService {
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
        ],
        awaitRefetchQueries: true,
      })
      .toPromise();
  }
}
