import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NonActiveTime } from '../../models/non-active-time.model';
import { FetchResult } from 'apollo-link';

const GET_ALL_NON_ACTIVE_TIMES_QUERY = gql`
  {
    nonActiveTimes {
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
  title: string,
  isAllDayEvent: boolean,
  startDateTime: Date,
  endDateTime: Date,
  isAllClassesEvent: boolean,
  classes: string[],
) => gql`
  mutation {
    createNonActiveTime(nonActiveTime: {
      title: "${title}"
      isAllDayEvent: "${isAllDayEvent}"
      startDateTime: "${startDateTime}"
      endDateTime: "${endDateTime}"
      isAllClassesEvent: "${isAllClassesEvent}"
      classesIds: "${classes}"
    }){ _id }
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
  updateNonActiveTime(id: "${id}", nonActiveTime: {
    title: "${title}"
    isAllDayEvent: "${isAllDayEvent}"
    startDateTime: "${startDateTime}"
    endDateTime: "${endDateTime}"
    isAllClassesEvent: "${isAllClassesEvent}"
    classes: "${classesIds}"
  }){ _id }
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
          console.warn('user.component::ngInInit:: empty stream received');
          return observableOf([]);
        }),
      );
  }

  public create(
    title: string,
    isAllDayEvent: boolean,
    startDateTime: Date,
    endDateTime: Date,
    isAllClassesEvent: boolean,
    classes: string[],
  ): any {
    return this.apollo
      .mutate({
        mutation: CREATE_NON_ACTIVE_TIME_QUERY(
          title,
          isAllDayEvent,
          startDateTime,
          endDateTime,
          isAllClassesEvent,
          classes,
        ),
        refetchQueries: [
          {
            query: GET_ALL_NON_ACTIVE_TIMES_QUERY,
          },
        ],
        awaitRefetchQueries: true,
      })
      .toPromise();
  }

  public update(
    id: string,
    title: string,
    isAllDayEvent: boolean,
    startDateTime: Date,
    endDateTime: Date,
    isAllClassesEvent: boolean,
    classes: string[],
  ): any {
    return this.apollo
      .mutate({
        mutation: UPDATE_NON_ACTIVE_TIME_QUERY(
          id,
          title,
          isAllDayEvent,
          startDateTime,
          endDateTime,
          isAllClassesEvent,
          classes,
        ),
        refetchQueries: [
          {
            query: GET_ALL_NON_ACTIVE_TIMES_QUERY,
          },
        ],
        awaitRefetchQueries: true,
      })
      .toPromise();
  }

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
