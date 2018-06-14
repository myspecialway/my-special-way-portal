import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserType } from '../../models/user.model';

@Injectable()
export class AuthenticationService {
  private rememberMe: boolean;
  private username = '';
  private userRole: UserType;
  private tokenExpired = true;

  isNotExpired() {
    return this.tokenExpired;
  }
  getUsername() {
    return this.username;
  }
  getRole(): UserType {
    return this.userRole;
  }

  setRememberMe(rememberMe: boolean) {
    this.rememberMe = rememberMe;
  }
  getCurrentUser()  {
    if (this.rememberMe) {
      return JSON.parse(localStorage.getItem('token') || '{}');
    } else {
      return JSON.parse(sessionStorage.getItem('token') || '{}');
    }
  }
  constructor(private http: HttpClient) {  }

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
      const jwtHelper: JwtHelperService = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(tokenResponse.accessToken);
      this.tokenExpired = !jwtHelper.isTokenExpired(tokenResponse.accessToken);
      this.username = decodedToken.username;
      this.userRole = decodedToken.role;

      // console.log(`token ${decodedToken.username} | ${decodedToken.role} | ${expirationDate} | ${isExpired}`);

      return tokenResponse;
    } catch (error) {
      const typedError = error as HttpErrorResponse;

      if (typedError.status !== 401) {
        throw error;
      }
    }
    return null;
  }

  logout() {
    if (this.rememberMe) {
      localStorage.removeItem('token');
    } else {
      sessionStorage.removeItem('token');
    }
  }
}
