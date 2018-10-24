import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { LessonQuery } from '../../models/lesson.model';
import { FetchResult } from 'apollo-link';
import { catchError, map } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

@Injectable()
export class LessonService {
  constructor(private apollo: Apollo) {}

  getLessons() {
    return this.apollo
      .query<LessonQuery>({
        query: gql`
          {
            lessons {
              _id
              title
              icon
            }
          }
        `,
      })
      .toPromise()
      .then((res) => res.data.lessons);
  }
  //public getAllLessons(): Observable<{lessons:  LessonQuery[]}>{
  public getAllLessons(): any {
    return this.apollo
      .watchQuery<{ lessons: LessonQuery[] }>({
        query: gql`
          {
            lessons {
              _id
              title
              icon
            }
          }
        `,
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
  public async delete(lessonId: string): Promise<FetchResult<Record<string, any>>> {
    return this.apollo
      .mutate({
        mutation: gql`
      mutation {
        deleteLesson(
          id: "${lessonId}"
        )
    }`,
        refetchQueries: [
          {
            query: gql`
              {
                lessons {
                  _id
                  title
                  icon
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
