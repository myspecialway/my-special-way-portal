import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { UserType } from '../../models/user.model';
import { Apollo } from 'apollo-angular';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';
import {Get} from '../../utils/get';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private apollo: Apollo,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    await this.authService.checkRestoreAuthData();
    const response = await this.apollo.query<{ userProfile: UserProfileStateModel }>({
      query: gql`
      query {
        userProfile @client{
          role
          token
        }
      }
    `}).toPromise();

    if (
      response.data.userProfile &&
      response.data.userProfile.token &&
      !this.authService.isTokenExpired(response.data.userProfile.token)
      && this.isAuthorized(route, response.data.userProfile.role)
    ) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  isAuthorized(route: ActivatedRouteSnapshot, userRole: UserType) {
    // console.log(`route ${route.url} | User type ${userRole}`);
    // TODO: authorization logic
    // this will be passed from the route config
    // on the data property
    const expectedRoles = Get.getObject(route, 'data.expectedRole');
    // console.log('expectedRoles:' , expectedRoles, '  userRole:', userRole, '  UserType[userRole]:', UserType[userRole]);
    if (expectedRoles && (expectedRoles as string[]).includes(UserType[userRole])) {
      return true;
    }
    return false;
  }
}
