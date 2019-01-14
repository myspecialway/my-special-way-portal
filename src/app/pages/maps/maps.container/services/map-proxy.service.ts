import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';

@Injectable()
export class MapProxyService {
  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService) {}

  read<T>(id?: string): Observable<T> {
    const url = id ? `${environment.hotConfig.MSW_HOT_UPLOAD_MAP}/${id}` : environment.hotConfig.MSW_HOT_UPLOAD_MAP;
    const options = this.buildHeaders();
    return this.httpClient.get<T>(url, options);
  }
  delete<T>(id?: string): Observable<T> {
    const url = `${environment.hotConfig.MSW_HOT_UPLOAD_MAP}/${id}`;
    const options = this.buildHeaders();
    return this.httpClient.delete<T>(url, options);
  }

  private buildHeaders() {
    const headers = new HttpHeaders()
      .set('authorization', ('Bearer ' + this.authenticationService.getTokenFromLocalStore()) as string)
      .set('Content-Type', 'application/json');

    const options = {
      headers,
    };
    return options;
  }
}
