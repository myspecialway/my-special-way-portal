import { QUERY_GET_LABELS_BY_TYPE, QUERY_GET_ALL_LABELS } from './label.graphql';
import { LabelQuery, LabelType, Label } from './../../models/label.model';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class LabelsService {
  constructor(private apollo: Apollo) {}

  getAllLabels() {
    return this.apollo
      .query<LabelQuery>({
        query: QUERY_GET_ALL_LABELS,
      })
      .toPromise()
      .then((res) => res.data.labels);
  }

  getLabelsByType(type: LabelType) {
    return this.apollo
      .query<LabelQuery>({
        query: QUERY_GET_LABELS_BY_TYPE,
        variables: { type },
      })
      .toPromise();
  }
}
