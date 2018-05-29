import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }
  login(username: string, password: string) {
    return this.http.post<any>('/api/authenticate', { username: username, password: password})
      .map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      });
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
