import { AuthGuard } from '../authentication/auth.guard';
import { AuthenticationService } from '../authentication/authentication.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Apollo } from 'apollo-angular';

describe('auth guard', () => {
  let routerMock: Partial<Router>;
  let authService: Partial<AuthenticationService>;
  let apolloQueryFnMock: jest.Mock;
  let apolloMutateFnMock: jest.Mock;
  let apolloMock: Partial<Apollo>;
  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };

    apolloQueryFnMock = jest.fn();
    apolloMutateFnMock = jest.fn();
    apolloMock = {
      query: jest.fn().mockReturnValue({
        toPromise: apolloQueryFnMock,
      }),
      mutate: jest.fn().mockReturnValue({
        toPromise: apolloMutateFnMock,
      }),
    } as Partial<Apollo>;

    authService = {
      isTokenExpired: jest.fn(),
      checkRestoreAuthData: jest.fn(),
    } as Partial<AuthenticationService>;
  });

  it('should return true if token has been found', async () => {
    // given
    apolloQueryFnMock.mockReturnValueOnce({
      data: {
        userProfile: {
          token: 'some-valid-token',
        },
      },
    });
    (authService.isTokenExpired as jest.Mock).mockReturnValueOnce(false);
    const guard = new AuthGuard(routerMock as Router, authService as AuthenticationService, apolloMock as Apollo);

    // when
    const response = await guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    // then
    expect(response).toBe(true);
  });

  it('should navigate to login page if token not found and return false', async () => {
    // given
    const guard = new AuthGuard(routerMock as Router, authService as AuthenticationService, apolloMock as Apollo);
    apolloQueryFnMock.mockReturnValueOnce({
      data: {
        userProfile: null,
      },
    });

    const response = await guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(response).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalled();
  });
});
