import { Apollo, ApolloModule } from 'apollo-angular';
import { NgModule } from '@angular/core';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { environment } from '../../environments/environment';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
// import { updateUserProfile } from './state-resolvers';
import { ApolloLink } from 'apollo-link';

@NgModule({
  imports: [
    ApolloModule,
    HttpLinkModule,
  ],
})
export class MSWApolloModule {
  constructor(private apollo: Apollo, private link: HttpLink) {
    const httpLink = this.link.create({ uri: environment.beUrl });
    const inMemCache = new InMemoryCache();
    const stateLink = withClientState({
      cache: inMemCache,
      resolvers: {
        Mutation: {
          updateUserProfile: (_, { userProfile }, { cache }) => {
            cache.writeData({
              data: {
                userProfile: {
                  ...userProfile,
                  __typename: 'UserProfile',
                },
              },
            });
          },
        },
      },
      defaults: {
        userProfile: {
          username: 'defaultusername',
          __typename: 'UserProfile',
        },
      },
    });

    this.apollo.create({
      cache: inMemCache,
      link: ApolloLink.from([stateLink]),
    });
  }
}
