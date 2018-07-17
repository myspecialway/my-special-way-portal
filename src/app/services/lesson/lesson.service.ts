import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Lesson, LessonQuery } from '../../models/lesson.model';

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
      .toPromise();
  }
}
