jest.mock('@angular/common/http');

import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let httpClient: HttpClient;
  let toPromiseFn: jest.Mock;

  beforeEach(() => {
    httpClient = new HttpClient(null);
    toPromiseFn = jest.fn();
    (httpClient.post as jest.Mock).mockReturnValue({
      toPromise: toPromiseFn,
    });

    authService = new AuthenticationService(httpClient);
  });

  it('should create localstorage token key on authentication sucess', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: 'some token',
    };

    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    const loginResponse = await authService.login('someusername', 'somepassword');

    expect(loginResponse.accessToken).toBe('some token');
  });

  it('should return null if authentication endpoint returned status code 401', async () => {
    const mockedResponse = {
      status: 401,
    };

    (httpClient.post as jest.Mock).mockImplementation(() => {
      throw mockedResponse;
    });

    const loginResponse = await authService.login('someusername', 'somepassword');

    expect(loginResponse).toBe(null);
  });

  it('should throw an exception if authentication endpoint returned status code 500', () => {
    const mockedResponse = {
      status: 500,
    };

    (httpClient.post as jest.Mock).mockImplementation(() => {
      throw mockedResponse;
    });

    return expect(authService.login('someusername', 'somepassword')).rejects.toEqual({ status: 500 });
  });

  it('should remove token from localstorage logout', () => {
    authService.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
