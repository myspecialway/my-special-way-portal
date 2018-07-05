jest.mock('@angular/common/http');

import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';
import { Apollo } from 'apollo-angular';
import { ApolloConfigFactory } from '../../apollo/state/apollo-config.factory';
import { HttpLink } from 'apollo-angular-link-http';

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let httpClient: HttpClient;
  let toPromiseFn: jest.Mock;
  const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI
                    6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
  beforeEach(() => {
    httpClient = new HttpClient({} as HttpHandler);
    toPromiseFn = jest.fn();
    (httpClient.post as jest.Mock).mockReturnValue({
      toPromise: toPromiseFn,
    });

    const apollo = new Apollo();
    const apolloConfig = new ApolloConfigFactory(new HttpLink(httpClient), apollo);
    apollo.create(apolloConfig.createConfig());
    authService = new AuthenticationService(httpClient, apollo);
  });

  it('should create localstorage token key on authentication sucess with rememberme enabled', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: mockToken,
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    await authService.login('someusername', 'somepassword', true);
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('should not create localstorage token key on authentication sucess with rememberme disabled', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: mockToken,
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    await authService.login('someusername', 'somepassword', false);
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('should return false if authentication endpoint returned status code 401', async () => {
    const mockedResponse = {
      status: 401,
    };

    (httpClient.post as jest.Mock).mockImplementation(() => {
      throw mockedResponse;
    });

    const loginResponse = await authService.login('someusername', 'somepassword', false);

    expect(loginResponse).toBe(false);
  });

  it('should throw an exception if authentication endpoint returned status code 500', () => {
    const mockedResponse = {
      status: 500,
    };

    (httpClient.post as jest.Mock).mockImplementation(() => {
      throw mockedResponse;
    });

    return expect(authService.login('someusername', 'somepassword', false)).rejects.toEqual({ status: 500 });
  });

  it('should remove token from localstorage logout  if rememberMe', () => {
    authService.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should remove token from sessionstorage logout if !rememberMe', () => {
    authService.logout();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
  });

});
