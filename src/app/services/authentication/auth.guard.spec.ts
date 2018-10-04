import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './authentication.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { UserRole, UserType } from '../../models/user.model';

describe('auth guard', () => {
  let routerMock: Partial<Router>;
  let authService: Partial<AuthenticationService>;
  let apolloQueryFnMock: jest.Mock;
  let apolloMutateFnMock: jest.Mock;
  let apolloMock: Partial<Apollo>;

  const MOCK_PARAM_MAP = {
    keys: [],
  };

  const MOCK_URL_SEGMENT = {
    path: '',
    parameters: { a: 'a' },
    parameterMap: MOCK_PARAM_MAP,
  };

  const MOCK_ACTIVE_ROUTE_SNAPSHOT = {
    url: [MOCK_URL_SEGMENT],
    params: null,
    queryParams: null,
    fragment: '',
    data: { expectedRole: [UserType.PRINCIPLE] },
    outlet: '',
    component: null,
    routeConfig: null,
    root: null,
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
    paramMap: MOCK_PARAM_MAP,
    queryParamMap: MOCK_PARAM_MAP,
  };

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
          role: UserRole.PRINCIPLE,
        },
      },
    });
    (authService.isTokenExpired as jest.Mock).mockReturnValueOnce(false);
    const guard = new AuthGuard(routerMock as Router, authService as AuthenticationService, apolloMock as Apollo);
    guard.isAuthorized = jest.fn(() => true);

    // when
    const response = await guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    // then
    expect(response).toBe(true);
  });

  it('should navigate to login page if token not found and return false', async () => {
    // given
    const guard = new AuthGuard(routerMock as Router, authService as AuthenticationService, apolloMock as Apollo);
    guard.isAuthorized = jest.fn(() => true);
    apolloQueryFnMock.mockReturnValueOnce({
      data: {
        userProfile: null,
        role: UserRole.PRINCIPLE,
      },
    });

    const response = await guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(response).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should navigate to login page if not authorized and return false', async () => {
    // given
    (authService.isTokenExpired as jest.Mock).mockReturnValueOnce(false);
    const guard = new AuthGuard(routerMock as Router, authService as AuthenticationService, apolloMock as Apollo);
    apolloQueryFnMock.mockReturnValueOnce({
      data: {
        userProfile: {
          token: 'some-valid-token',
          role: UserRole.STUDENT,
        },
      },
    });

    const response = await guard.canActivate(
      MOCK_ACTIVE_ROUTE_SNAPSHOT as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );

    expect(response).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should return true if token found and authorized', async () => {
    // given
    (authService.isTokenExpired as jest.Mock).mockReturnValueOnce(false);
    const guard = new AuthGuard(routerMock as Router, authService as AuthenticationService, apolloMock as Apollo);
    apolloQueryFnMock.mockReturnValueOnce({
      data: {
        userProfile: {
          token: 'some-valid-token',
          role: UserRole.PRINCIPLE,
        },
      },
    });

    const response = await guard.canActivate(
      MOCK_ACTIVE_ROUTE_SNAPSHOT as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );
    expect(response).toBe(true);
  });
});
