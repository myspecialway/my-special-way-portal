import { AuthGuard } from '../auth.guard';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import {  ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { TreeNode } from '@angular/router/src/utils/tree';

describe('auth guard', () => {
  let routerMock: Partial<Router>;
  const authService = new AuthenticationService(new HttpClient({} as HttpHandler));
  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };
  });
  it('should return true if token has been found', () => {
    const guard = new AuthGuard(routerMock as Router, authService);
    // (localStorage.getItem as jest.Mock).mockReturnValueOnce('some token');
    authService.isLoggedIn = jest.fn().mockReturnValueOnce('some token');
    const response = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(response).toBe(true);
  });
  it('should navigate to login page if token not found and return false', () => {
    const guard = new AuthGuard(routerMock as Router, authService);
    (localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

    const response = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(response).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalled();
  });
});
