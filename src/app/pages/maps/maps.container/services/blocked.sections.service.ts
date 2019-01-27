import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators/map';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';

import BlockedSection from '../../../../models/blocked-section.model';
import {
  MUTATE_ADD_BLOCKED_SECTION,
  MUTATE_DELETE_BLOCKED_SECTION,
  MUTATE_UPDATE_BLOCKED_SECTION,
  QUERY_GET_ALL_BLOCKED_SECTIONS_BY_LOCATIONS,
} from './maps.graphql';

import { DeleteBlockedSectionResponse } from '../../../../models/responses/delete-blocked-section-response.model';
import { UpdateBlockedSectionResponse } from '../../../../models/responses/update-blocked-section-response.model';

@Injectable()
export class BlockedSectionsService {
  constructor(private apollo: Apollo) {}

  getBlockSectionsByLocations(locations: string[]) {
    return this.apollo
      .watchQuery<{ blockedSections: BlockedSection[] }>({
        query: QUERY_GET_ALL_BLOCKED_SECTIONS_BY_LOCATIONS,
        variables: { locations },
      })
      .valueChanges.pipe(
        map((res) => {
          return (res.data as any).blockedSectionsByLocations;
        }),
        catchError((err: TypeError) => {
          return observableOf([]);
        }),
      );
  }

  create(blockedSection: BlockedSection, locations: string[]) {
    return this.apollo
      .mutate({
        mutation: MUTATE_ADD_BLOCKED_SECTION,
        variables: { blockedSection: { ...blockedSection } },
        refetchQueries: [{ query: QUERY_GET_ALL_BLOCKED_SECTIONS_BY_LOCATIONS, variables: { locations } }],
        awaitRefetchQueries: true,
      })
      .toPromise();
  }

  update(blockedSection: BlockedSection, locations: string[]): Promise<string> {
    return this.apollo
      .mutate({
        mutation: MUTATE_UPDATE_BLOCKED_SECTION,
        variables: { id: blockedSection._id, blockedSection: { ...blockedSection, _id: undefined } },
        refetchQueries: [{ query: QUERY_GET_ALL_BLOCKED_SECTIONS_BY_LOCATIONS, variables: { locations } }],
        awaitRefetchQueries: true,
      })
      .pipe(map((res: { data: UpdateBlockedSectionResponse }) => res.data.updateBlockedSection._id))
      .toPromise() as Promise<string>;
  }

  delete(id: string, locations: string[]) {
    return this.apollo
      .mutate({
        mutation: MUTATE_DELETE_BLOCKED_SECTION,
        variables: { id },
        refetchQueries: [{ query: QUERY_GET_ALL_BLOCKED_SECTIONS_BY_LOCATIONS, variables: { locations } }],
      })
      .pipe(map((res: { data: DeleteBlockedSectionResponse }) => res.data.deleteBlockedSection._id))
      .toPromise();
  }
}
