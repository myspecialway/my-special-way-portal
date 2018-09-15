import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWTTokenPayloadResponse } from '../../models/jwt-token-resonse.model';
import { Apollo } from 'apollo-angular';
import { UPDATE_USER_PROFILE } from '../../apollo/state/mutations/update-user-profile.mutation';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';

@Injectable()
export class AuthenticationService {
  private jwtHelper = new JwtHelperService();
  private isStateRestored = false;

  constructor(
    private http: HttpClient,
    private apollo: Apollo,
  ) { }

  private getTokenFromLocalStore() {
    return localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
  }

  async checkRestoreAuthData() {
    if (this.isStateRestored) {
      return;
    }

    this.isStateRestored = true;
    const token = this.getTokenFromLocalStore();

    if (!token) {
      return;
    }

    const userProfile = this.getProfileFromToken(token);
    await this.pushUserProfileToState(userProfile);
  }

  async login(username: string, password: string, isRememberMeActive: boolean): Promise<boolean> {
    try {
      const tokenResponse = await this.http.post<LoginResponse>(
        environment.hotConfig.MSW_HOT_LOGIN_ENDPOINT,
        { username, password },
      ).toPromise();

      if (!tokenResponse) {
        return false;
      }

      if (isRememberMeActive) {
        localStorage.setItem('token', tokenResponse.accessToken);
      } else {
        sessionStorage.setItem('token', tokenResponse.accessToken);
      }

      const userProfile = this.getProfileFromToken(tokenResponse.accessToken);
      await this.pushUserProfileToState(userProfile);

      return true;
    } catch (error) {
      const typedError = error as HttpErrorResponse;

      if (typedError.status !== 401) {
        throw error;
      }

      return false;
    }
  }

  private getProfileFromToken(token: string): UserProfileStateModel {
    const jwrParsedToken = this.parseToken(token);
    const userProfile = new UserProfileStateModel(jwrParsedToken);
    userProfile.token = token;

    return userProfile;
  }

  private parseToken(token: string): JWTTokenPayloadResponse {
    const decodedToken = this.jwtHelper.decodeToken(token) as JWTTokenPayloadResponse;
    return decodedToken;
  }

  private async pushUserProfileToState(userProfile: UserProfileStateModel) {
    return this.apollo.mutate({
      mutation: UPDATE_USER_PROFILE,
      variables: {
        userProfile,
      },
    }).toPromise();
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

}
