import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { InputLocation, LocationQuery } from '../../models/location.model';
import * as _ from 'lodash';

const allLocationFields = `
              _id
              name
              disabled
              location_id
              position {
                latitude
                longitude
                floor
              }
            `;

const updateLocation = gql`
    mutation updateLocation($id: ID!, $location: InputLocation!) {
      updateLocation(id: $id, location: $location) {
        ${allLocationFields}
      }
    }
  `;

const getAllLocationsQuery = gql`{
          locations {
           ${allLocationFields}
          }
        }`;

@Injectable()
export class LocationService {
  constructor(private apollo: Apollo) {}

  getLocations() {
    return this.apollo
      .query<LocationQuery>({
        query: getAllLocationsQuery,
      })
      .toPromise()
      .then((res) => res.data.locations);
  }

  update(location: InputLocation) {
    return this.apollo
      .mutate({
        mutation: updateLocation,
        variables: {
          id: location._id,
          location: _.omit(location, ['_id']),
        },
        refetchQueries: [
          {
            query: getAllLocationsQuery,
          },
        ],
        awaitRefetchQueries: true,
      })
      .toPromise()
      .then((res) => {
        if (res.data) {
          return res.data.locations;
        }
      });
  }
}
