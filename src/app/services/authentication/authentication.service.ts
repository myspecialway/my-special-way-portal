import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthenticationService {
  rememberMe: boolean;

  setRememberMe(rememberMe: boolean) {
    this.rememberMe = rememberMe;
  }
  getCurrentUser(): string {
    if (this.rememberMe) {
      return localStorage.getItem('token');
    } else {
      return sessionStorage.getItem('token');
    }
  }
  constructor(private http: HttpClient) { }
  async login(username: string, password: string): Promise<LoginResponse> {
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
