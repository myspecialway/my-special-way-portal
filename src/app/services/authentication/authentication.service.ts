import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const tokenResponse = await this.http.post<LoginResponse>(
        environment.loginUrl,
        { username, password },
      ).toPromise<LoginResponse>();
      localStorage.setItem('token', tokenResponse.accessToken); // TODO: Add logic for rememberMe - localstorage vs session storage
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
    localStorage.removeItem('token');
  }
}
