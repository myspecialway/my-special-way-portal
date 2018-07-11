import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { UserType } from '../../models/user.model';
import { Apollo } from 'apollo-angular';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private apollo: Apollo,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const response = await this.apollo.query<{ userProfile: UserProfileStateModel }>({
      query: gql`
      query {
        userProfile @client{
          role
          token
        }
      }
    `}).toPromise();

    if (response.data.userProfile && response.data.userProfile.token && !this.authService.isTokenExpired(response.data.userProfile.token)
      && this.isAuthorized(route.url, response.data.userProfile.role)) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  isAuthorized(route: UrlSegment[], userRole: UserType) {
    // console.log(`route ${route} | User type ${userRole}`);
    // if (route[0].path.toString() === 'user' && userRole.toString() === 'TEACHER') {
    //   return false;
    // }
    return true; // TODO: authorization logic
  }
}
