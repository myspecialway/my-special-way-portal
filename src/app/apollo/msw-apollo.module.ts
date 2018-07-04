import { Apollo, ApolloModule } from 'apollo-angular';
import { NgModule } from '@angular/core';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { environment } from '../../environments/environment';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { updateUserProfile, defaultUserProfile, UserProfileStateModel } from './state-resolvers';
import { ApolloLink } from 'apollo-link';
import gql from 'graphql-tag';

@NgModule({
  imports: [
    ApolloModule,
    HttpLinkModule,
  ],
})
export class MSWApolloModule {
  constructor(private apollo: Apollo, private link: HttpLink) {
    const authLink = setContext(async (_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${await this.getTokenFromStore()}`,
        },
      };
    });
    const httpLink = this.link.create({ uri: environment.beUrl });
    const inMemCache = new InMemoryCache();
    const stateLink = withClientState({
      cache: inMemCache,
      resolvers: {
        Mutation: {
          updateUserProfile,
        },
      },
      defaults: {
        userProfile: defaultUserProfile,
      },
    });

    this.apollo.create({
      cache: inMemCache,
      link: ApolloLink.from([stateLink, authLink.concat(httpLink)]),
    });
  }

  async getTokenFromStore() {
    const response = await this.apollo.query<{ userProfile: UserProfileStateModel }>({
      query: gql`
      query {
        userProfile @client{
          token
        }
      }
    `,
    }).toPromise();

    return response.data.userProfile.token;
  }
}
