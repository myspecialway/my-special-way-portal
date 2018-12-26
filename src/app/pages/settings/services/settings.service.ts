import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { QUERY_GET_SETTINGS, MUTATE_UPDATE_SETTINGS } from './settings.graphql';
import { of as observableOf } from 'rxjs/observable/of';
import { Settings, InputSettings } from '../../../models/settings.mode';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class SettingService {
  constructor(private apollo: Apollo) {}

  getAll() {
    return this.apollo
      .watchQuery<{ settings: Settings }>({
        query: QUERY_GET_SETTINGS,
      })
      .valueChanges.pipe(
        map((res: { data: { settings: Settings } }) => res.data.settings),
        catchError((err: TypeError) => {
          console.warn('settings.component::ngInInit:: empty stream recieved');
          return observableOf([]);
        }),
      );
  }
  update({ _id, teachercode }: Settings) {
    const inputSettings: InputSettings = { teachercode };
    return this.apollo
      .mutate({
        mutation: MUTATE_UPDATE_SETTINGS,
        variables: {
          id: _id,
          settings: inputSettings,
        },
        refetchQueries: [{ query: QUERY_GET_SETTINGS }],
      })
      .toPromise();
  }
}
