import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators/map';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';

import BlockedSection from '../../../../models/blocked-section.model';
import { QUERY_GET_ALL_BLOCKED_SECTIONS, MUTATE_ADD_BLOCKED_SECTION } from './maps.graphql';

@Injectable()
export class MapsService {
  constructor(private apollo: Apollo) {}

  getAllBlockedSections() {
    return this.apollo
      .watchQuery<{ blockedSections: BlockedSection[] }>({
        query: QUERY_GET_ALL_BLOCKED_SECTIONS,
      })
      .valueChanges.pipe(
        map((res) => {
          return res.data.blockedSections;
        }),
        catchError((err: TypeError) => {
          return observableOf([]);
        }),
      );
  }

  create(blockedSection: BlockedSection) {
    return this.apollo
      .mutate({
        mutation: MUTATE_ADD_BLOCKED_SECTION,
        variables: { blockedSection: { ...blockedSection } },
        refetchQueries: [{ query: QUERY_GET_ALL_BLOCKED_SECTIONS }],
      })
      .toPromise();
  }
}
