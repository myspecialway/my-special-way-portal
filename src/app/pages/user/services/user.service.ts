import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import User from '../../../models/User';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {
  private readonly API_URL = './mocks/users.json';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>('/api/users');
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  getById(id: number) {
    return this.http.get('/api/users/' + id);
  }

  create(user: User) {
    return this.http.post('/api/users', user);
  }

  update(user: User) {
    return this.http.put('/api/users/' + user.id, user);
  }

  delete(id: number) {
    return this.http.delete('/api/users/' + id);
  }
}
