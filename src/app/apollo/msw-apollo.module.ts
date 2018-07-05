import { Apollo, ApolloModule } from 'apollo-angular';
import { NgModule } from '@angular/core';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { environment } from '../../environments/environment';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { updateUserProfile, defaultUserProfile, UserProfileStateModel } from './state/state-resolvers';
import { ApolloLink } from 'apollo-link';
import gql from 'graphql-tag';
import { ApolloConfigFactory } from './state/apollo-config.factory';

@NgModule({
  imports: [
    ApolloModule,
    HttpLinkModule,
  ],
  providers: [
    ApolloConfigFactory,
  ],
})
export class MSWApolloModule {
  constructor(apollo: Apollo, apolloConfigFactory: ApolloConfigFactory) {
    apollo.create(apolloConfigFactory.createConfig());
  }
}
