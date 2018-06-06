import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import { error } from 'util';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }
  login(username: string, password: string) {
    return this.http.post<any>('https://msw-server.azurewebsites.net/login', { username, password})
      .map((token) => {
          if (token && token.accessToken) {
            localStorage.setItem('token', token.accessToken);
          // console.log(JSON.stringify(token.accessToken));
          }
          return error;
      });
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
  }
}
