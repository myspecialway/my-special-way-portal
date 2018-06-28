import { Apollo, ApolloModule } from 'apollo-angular';
import { NgModule } from '@angular/core';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { environment } from '../../environments/environment';
import { InMemoryCache } from 'apollo-cache-inmemory';

@NgModule({
  imports: [
    ApolloModule,
    HttpLinkModule,
  ],
})
export class MSWApolloModule {
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    const http = this.httpLink.create({ uri: environment.beUrl });
    this.apollo.create({
      link: http,
      cache: new InMemoryCache(),
    });
  }
}
