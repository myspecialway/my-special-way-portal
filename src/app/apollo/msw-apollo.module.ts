import { Apollo, ApolloModule } from 'apollo-angular';
import { NgModule } from '@angular/core';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { ApolloConfigFactory } from './state/apollo-config.factory';

@NgModule({
  imports: [ApolloModule, HttpLinkModule],
  providers: [ApolloConfigFactory],
})
export class MSWApolloModule {
  constructor(apollo: Apollo, apolloConfigFactory: ApolloConfigFactory) {
    apollo.create(apolloConfigFactory.createConfig());
  }
}
