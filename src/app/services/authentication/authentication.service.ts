import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class AuthenticationService {
  private rememberMe: boolean;

  setRememberMe(rememberMe: boolean) {
    this.rememberMe = rememberMe;
  }
  getCurrentUser()  {
    if (this.rememberMe) {
      return localStorage.getItem('token');
    } else {
      return sessionStorage.getItem('token');
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
      const expirationDate = jwtHelper.getTokenExpirationDate(tokenResponse.accessToken);
      const isExpired = jwtHelper.isTokenExpired(tokenResponse.accessToken);
      console.log(`token ${decodedToken.username} | ${expirationDate} | ${isExpired}`);

      return tokenResponse;
    } catch (error) {
      const typedError = error as HttpErrorResponse;

      if (typedError.status !== 401) {
        throw error;
      }

      return null;
    }
  }

  logout() {
    if (this.rememberMe) {
      localStorage.removeItem('token');
    } else {
      sessionStorage.removeItem('token');
    }
  }
}
