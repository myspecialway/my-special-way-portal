import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserType } from '../../models/user.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { JWTTokenPayloadResponse } from '../../models/jwt-token-resonse.model';
import { Apollo } from 'apollo-angular';
import { UPDATE_USER_PROFILE } from '../../apollo/state/mutations/update-user-profile.mutation';
import { UserProfileStateModel } from '../../apollo/state-resolvers';
import { GET_USER_PROFILE } from '../../apollo/state/queries/get-user-profile.query';

@Injectable()
export class AuthenticationService {
  private rememberMe: boolean;
  private username = new BehaviorSubject('');
  private userRole: UserType;
  private tokenExpired = true;
  private token;

  constructor(
    private http: HttpClient,
    private apollo: Apollo,
  ) {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    } else {
      this.token = sessionStorage.getItem('token');
    }
    if (this.isLoggedIn()) {
      this.parseToken(this.token || undefined);
    }
  }

  isNotExpired() {
    return this.tokenExpired;
  }
  getUsername(): Observable<string> {
    return this.username;
  }
  getRole(): UserType {
    return this.userRole;
  }

  setRememberMe(rememberMe: boolean) {
    this.rememberMe = rememberMe;
  }
  isLoggedIn() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  async login(username: string, password: string): Promise<LoginResponse | null> {
    try {
      const tokenResponse = await this.http.post<LoginResponse>(
        environment.loginUrl,
        { username, password },
      ).toPromise<LoginResponse>();
      if (this.rememberMe) {
        localStorage.setItem('token', tokenResponse.accessToken);
      } else {
        sessionStorage.setItem('token', tokenResponse.accessToken);
      }
      this.token = tokenResponse.accessToken;
      const jwrParsedToken = this.parseToken(this.token);

      const userProfile = new UserProfileStateModel();
      userProfile.username = jwrParsedToken.username;

      await this.apollo.watchQuery<any>({
        query: GET_USER_PROFILE,
      }).valueChanges.subscribe((userProf) => {
        console.log(userProf);
      });

      const mutateResponse = await this.apollo.mutate({
        mutation: UPDATE_USER_PROFILE,
        variables: {
          userProfile,
        },
      }).toPromise();

      return tokenResponse;
    } catch (error) {
      const typedError = error as HttpErrorResponse;

      if (typedError.status !== 401) {
        throw error;
      }
    }
    return null;
  }

  private parseToken(token: string): JWTTokenPayloadResponse {
    const jwtHelper: JwtHelperService = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token) as JWTTokenPayloadResponse;
    this.tokenExpired = !jwtHelper.isTokenExpired(token);
    this.username.next(decodedToken.username);
    this.userRole = decodedToken.role;

    return decodedToken;
  }
  getToken() {
    return this.token;
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.rememberMe = false;
    this.username.next('');
    // this.userRole = undefined;
    this.tokenExpired = true;
    this.token = undefined;
  }

}
