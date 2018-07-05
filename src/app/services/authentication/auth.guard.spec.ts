import { AuthGuard } from '../authentication/auth.guard';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ApolloConfigFactory } from '../../apollo/state/apollo-config.factory';
import { HttpLink } from 'apollo-angular-link-http';
import { UPDATE_USER_PROFILE } from '../../apollo/state/mutations/update-user-profile.mutation';

describe('auth guard', () => {
  let routerMock: Partial<Router>;
  let authService: AuthenticationService;
  let apollo: Apollo;
  const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI
                    6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
  beforeEach(() => {
    const httpClient = new HttpClient({} as HttpHandler);
    routerMock = {
      navigate: jest.fn(),
    };

    apollo = new Apollo();
    const apolloConfig = new ApolloConfigFactory(new HttpLink(httpClient), apollo);
    apollo.create(apolloConfig.createConfig());
    authService = new AuthenticationService(httpClient, apollo);
  });

  // TODO: find way to simulate not expired token
  // it('should return true if token has been found', async () => {
  //   await apollo.mutate({
  //     mutation: UPDATE_USER_PROFILE,
  //     variables: {
  //       userProfile: {
  //         token: mockToken,
  //       },
  //     },
  //   }).toPromise();

  //   const guard = new AuthGuard(routerMock as Router, authService as AuthenticationService, apollo as Apollo);
  //   const response = await guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
  //   expect(response).toBe(true);
  // });

  it('should navigate to login page if token not found and return false', async () => {
    const guard = new AuthGuard(routerMock as Router, authService, apollo);

    const response = await guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(response).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalled();
  });
});
