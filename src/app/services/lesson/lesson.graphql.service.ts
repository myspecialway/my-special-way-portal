import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { LessonQuery } from '../../models/lesson.model';
import { FetchResult } from 'apollo-link';

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
  public delete(lessonId: string): Promise<FetchResult<Record<string, any>>> {
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
