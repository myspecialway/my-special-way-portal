import { Injectable } from '@angular/core';
import { updateUserProfile, UserProfileStateModel, defaultUserProfile } from './resolvers/state.resolver';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { environment } from '../../../environments/environment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-angular-link-http';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloLink } from 'apollo-link';

@Injectable()
export class ApolloConfigFactory {
  constructor(private link: HttpLink, private apollo: Apollo) { }

  createConfig() {
    const authLink = setContext(async (_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${await this.getTokenFromStore()}`,
        },
      };
    });
    const httpLink = this.link.create({ uri: environment.hotConfig.MSW_HOT_GRAPHQL_ENDPOINT });
    const cache = new InMemoryCache({
      addTypename: false,
    });
    const stateLink = withClientState({
      cache,
      resolvers: {
        Mutation: {
          updateUserProfile,
        },
      },
      defaults: {
        userProfile: defaultUserProfile,
      },
    });

    return {
      cache,
      link: ApolloLink.from([stateLink, authLink.concat(httpLink)]),
    } as ApolloClientOptions<NormalizedCacheObject>;
  }

  private async getTokenFromStore() {
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
