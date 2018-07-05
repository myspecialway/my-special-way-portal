import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserType } from '../../models/user.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { UserProfileStateModel } from '../../apollo/state/state-resolvers';

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

    if (response.data.userProfile.token && !this.authService.isTokenExpired(response.data.userProfile.token)
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
