import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Observable, of as observableOf } from 'rxjs';
import { Lesson } from '../../models/lesson.model';
import { catchError, map } from 'rxjs/operators';
import { NonActiveTime } from '../../models/non-active-time.model';
import { FetchResult } from 'apollo-link';

const GET_ALL_NON_ACTIVE_TIMES_QUERY = gql`
  {
    NonActiveTime {
      _id
      title
      isAllDayEvent
      startDateTime
      endDateTime
      isAllClassesEvent
      classes {
        _id: string
        name: string
    }
  }
`;

const DELETE_NON_ACTIVE_TIME_QUERY = (id: string) => gql`
mutation {
  deleteNonActiveTime(
    id: "${id}"
  )
}`;

const CREATE_NON_ACTIVE_TIME_QUERY = (
  id: string,
  title: string,
  isAllDayEvent: boolean,
  startDateTime: Date,
  endDateTime: Date,
  isAllClassesEvent: boolean,
  classesIds: string[],
) => gql`
  mutation {
    createNonActiveTime {
      _id: "${id}"
      title: "${title}"
      isAllDayEvent: "${isAllDayEvent}"
      startDateTime: "${startDateTime}"
      endDateTime: "${endDateTime}"
      isAllClassesEvent: "${isAllClassesEvent}"
      classes: "${classesIds}"
  }`;

const UPDATE_NON_ACTIVE_TIME_QUERY = (
  id: string,
  title: string,
  isAllDayEvent: boolean,
  startDateTime: Date,
  endDateTime: Date,
  isAllClassesEvent: boolean,
  classesIds: string[],
) => gql`
  mutation {
    updateNonActiveTime {
      _id: "${id}"
      title: "${title}"
      isAllDayEvent: "${isAllDayEvent}"
      startDateTime: "${startDateTime}"
      endDateTime: "${endDateTime}"
      isAllClassesEvent: "${isAllClassesEvent}"
      classes: "${classesIds}"
  }`;

@Injectable()
export class NonActiveTimeService {
  constructor(private apollo: Apollo) {}

  public getAllNonActiveTimes(): Observable<NonActiveTime[]> {
    return this.apollo
      .watchQuery<{ nonActiveTime: NonActiveTime[] }>({
        query: GET_ALL_NON_ACTIVE_TIMES_QUERY,
      })
      .valueChanges.pipe(
        map((res) => {
          return res.data.nonActiveTime;
        }),
        catchError((err: TypeError) => {
          console.warn('user.component::ngInInit:: empty stream recieved');
          return observableOf([]);
        }),
      );
  }

  /*  public update(lessonId: string, title: string, icon: string): any {
    return this.apollo
      .mutate({
        mutation: UPDATE_NON_ACTIVE_TIME_QUERY(lessonId, title, icon),
        refetchQueries: [
          {
            query: GET_ALL_NON_ACTIVE_TIMES_QUERY,
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
  }*/

  public async delete(nonActiveTimeId: string): Promise<FetchResult<Record<string, any>>> {
    return this.apollo
      .mutate({
        mutation: DELETE_NON_ACTIVE_TIME_QUERY(nonActiveTimeId),
        refetchQueries: [
          {
            query: GET_ALL_NON_ACTIVE_TIMES_QUERY,
          },
        ],
        awaitRefetchQueries: true,
      })
      .toPromise();
  }
}
