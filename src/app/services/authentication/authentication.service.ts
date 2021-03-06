import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWTTokenPayloadResponse } from '../../models/jwt-token-resonse.model';
import { Apollo } from 'apollo-angular';
import { UPDATE_USER_PROFILE } from '../../apollo/state/mutations/update-user-profile.mutation';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';
import { UserUniqueValidationResponse } from '../../models/user-unique-validation-response.model';
import { of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { MUTATE_USER_FORGET_PASSWORD } from '../../pages/user/services/user.graphql';

@Injectable()
export class AuthenticationService {
  private jwtHelper = new JwtHelperService();
  private isStateRestored = false;

  constructor(private http: HttpClient, private apollo: Apollo) {}

  public getTokenFromLocalStore() {
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

  async firstLogin(firstLoginToken: string): Promise<UserProfileStateModel | null> {
    try {
      const tokenResponse = await this.http
        .post<LoginResponse>(environment.hotConfig.MSW_HOT_FIRSTLOGIN_ENDPOINT, { firstLoginToken })
        .toPromise();

      if (!tokenResponse) {
        return null;
      }

      this.saveTokenInStorage(false, tokenResponse);
      const userProfile = this.getProfileFromToken(tokenResponse.accessToken);
      await this.pushUserProfileToState(userProfile);

      return userProfile;
    } catch (error) {
      const typedError = error as HttpErrorResponse;

      if (typedError.status !== 401) {
        throw error;
      }
    }
    return null;
  }

  async login(username: string, password: string, isRememberMeActive: boolean): Promise<boolean> {
    try {
      const tokenResponse = await this.http
        .post<LoginResponse>(environment.hotConfig.MSW_HOT_LOGIN_ENDPOINT, { username, password })
        .toPromise();

      if (!tokenResponse) {
        return false;
      }

      this.saveTokenInStorage(isRememberMeActive, tokenResponse);

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

  async resetPassword(email: string): Promise<boolean> {
    try {
      await this.http.post<any>(environment.hotConfig.MSW_HOT_RESET_PASSWORD_ENDPOINT, { email }).toPromise();

      // const userProfile = this.getProfileFromToken(tokenResponse.accessToken);
      // await this.pushUserProfileToState(userProfile);

      return true;
    } catch (error) {
      const typedError = error as HttpErrorResponse;

      if (typedError.status !== 401) {
        throw error;
      }

      return false;
    }
  }
  private saveTokenInStorage(isRememberMeActive: boolean, tokenResponse: LoginResponse) {
    if (isRememberMeActive) {
      localStorage.setItem('token', tokenResponse.accessToken);
    } else {
      sessionStorage.setItem('token', tokenResponse.accessToken);
    }
  }
  async restorePassword(username: string) {
    return this.apollo
      .mutate({
        mutation: MUTATE_USER_FORGET_PASSWORD,
        variables: {
          username,
        },
      })
      .toPromise();
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
    return this.apollo
      .mutate({
        mutation: UPDATE_USER_PROFILE,
        variables: {
          userProfile,
        },
      })
      .toPromise();
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.apollo.getClient().cache.reset();
  }

  checkUsernameUnique(username: string, id: string | number) {
    if (!username) {
      return of(true);
    }
    const userID = id === '' ? undefined : id;
    try {
      return this.http
        .post<UserUniqueValidationResponse>(environment.hotConfig.MSW_HOT_USER_UNIQUE_VALIDATION_ENDPOINT, {
          username,
          id: userID,
        })
        .pipe(
          first(),
          map((res) => res.isUnique),
          catchError(() => of(true)),
        );
    } catch (error) {
      return of(true);
    }
  }
}
