import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators/map';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';

import BlockedSection from '../../../../models/blocked-section.model';
import {
  QUERY_GET_ALL_BLOCKED_SECTIONS,
  MUTATE_ADD_BLOCKED_SECTION,
  MUTATE_DELETE_BLOCKED_SECTION,
  MUTATE_UPDATE_BLOCKED_SECTION,
} from './maps.graphql';
import { DeleteBlockedSectionResponse } from '../../../../models/responses/delete-blocked-section-response.model';
import { UpdateBlockedSectionResponse } from '../../../../models/responses/update-blocked-section-response.model';

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

  update(blockedSection: BlockedSection): Promise<string> {
    return this.apollo
      .mutate({
        mutation: MUTATE_UPDATE_BLOCKED_SECTION,
        variables: { id: blockedSection._id, blockedSection: { ...blockedSection, _id: undefined } },
        refetchQueries: [{ query: QUERY_GET_ALL_BLOCKED_SECTIONS, variables: { id: blockedSection._id } }],
        awaitRefetchQueries: true,
      })
      .pipe(map((res: { data: UpdateBlockedSectionResponse }) => res.data.updateBlockedSection._id))
      .toPromise() as Promise<string>;
  }

  delete(id: number) {
    return this.apollo
      .mutate({
        mutation: MUTATE_DELETE_BLOCKED_SECTION,
        variables: { id },
        refetchQueries: [{ query: QUERY_GET_ALL_BLOCKED_SECTIONS }],
      })
      .pipe(map((res: { data: DeleteBlockedSectionResponse }) => res.data.deleteBlockedSection))
      .toPromise();
  }
}
