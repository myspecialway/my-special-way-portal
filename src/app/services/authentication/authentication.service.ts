import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { error } from 'util';
import { LoginResponse } from '../../models/login-response.model';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const tokenResponse = await this.http.post<LoginResponse>(
        'https://msw-server.azurewebsites.net/login',
        { username, password },
      ).toPromise<LoginResponse>();

      localStorage.setItem('token', tokenResponse.accessToken);
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
