import { FetchResult } from 'apollo-link';
import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { InputLocation, LocationQuery } from '../../models/location.model';
import * as _ from 'lodash';

const allLocationFields = `
              _id
              name
              location_id
              position {
                floor
              }
              icon
              type
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

const deleteLocationQuery = (locationId) => gql`
        mutation {
          deleteLocation(
            id: "${locationId}"
          )
        }`;
const createLocationQuery = ({ name, location_id, position: { floor }, icon, type, image_id }) => gql`
        mutation {
          createLocation(location: {
            name: "${name}"
            location_id: "${location_id}"
            icon: "${icon}"
            type: "${type}"
            position: {
              floor: ${floor}
            }
            image_id:${image_id}
          }){ _id }
        }`;

export const QUERY_GET_LOCATION_BY_MAP_ID = gql`
  query getLocationsByMapId($image_id: String!, $floor: Int) {
    locationsByMapId(image_id: $image_id, floor: $floor) {
      _id
      name
      location_id
      icon
      type
      image_id
      position {
        floor
      }
    }
  }
`;
@Injectable()
export class LocationService {
  constructor(private apollo: Apollo) { }

  getLocations() {
    return this.apollo
      .query<LocationQuery>({
        query: getAllLocationsQuery,
      })
      .toPromise()
      .then((res) => res.data.locations);
  }
  getLocationByMapId$(image_id: string, floor: number) {
    return this.apollo
      .watchQuery<LocationQuery>({
        query: QUERY_GET_LOCATION_BY_MAP_ID,
        variables: { image_id, floor },
      })
      .valueChanges.pipe(
        map((res) => (res.data as any).locationsByMapId),
        catchError((err: TypeError) => {
          return observableOf([]);
        }),
      );
  }

  getLocationsFeed$() {
    return this.apollo
      .watchQuery<LocationQuery>({
        query: getAllLocationsQuery,
      })
      .valueChanges.pipe(
        map((res) => res.data.locations),
        catchError((err: TypeError) => {
          return observableOf([]);
        }),
      );
  }
  public create(location): any {
    location.icon = location.icon || '';
    location.type = location.type || '';

    return this.apollo
      .mutate({
        mutation: createLocationQuery(location),
        refetchQueries: [
          {
            query: getAllLocationsQuery,
          },
        ],
        awaitRefetchQueries: true,
      })
      .toPromise();
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

  public async delete(locationId: string): Promise<FetchResult<Record<string, any>>> {
    return this.apollo
      .mutate({
        mutation: deleteLocationQuery(locationId),
        refetchQueries: [
          {
            query: getAllLocationsQuery,
          },
        ],
        awaitRefetchQueries: true,
      })
      .toPromise();
  }
}
