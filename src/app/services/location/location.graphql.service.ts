import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { LocationQuery } from '../../models/location.model';

@Injectable()
export class LocationService {
  constructor(private apollo: Apollo) {}

  getLocations() {
    return this.apollo
      .query<LocationQuery>({
        query: gql`
          {
            locations {
              _id
              name
              disabled
              position {
                latitude
                longitude
                floor
              }
            }
          }
        `,
      })
      .toPromise()
      .then((res) => res.data.locations);
  }
}
