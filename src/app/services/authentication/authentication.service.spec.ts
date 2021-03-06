jest.mock('@angular/common/http');

import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';
import { of } from 'rxjs/observable/of';

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let httpClient: HttpClient;
  let toPromiseFn: jest.Mock;
  let apolloQueryFnMock: jest.Mock;
  let apolloMutateFnMock: jest.Mock;
  let apolloMock: any;

  const expiredMockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI
                    6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
  beforeEach(() => {
    httpClient = new HttpClient({} as HttpHandler);
    toPromiseFn = jest.fn();
    (httpClient.post as jest.Mock).mockReturnValue({
      toPromise: toPromiseFn,
    });

    apolloQueryFnMock = jest.fn();
    apolloMutateFnMock = jest.fn();
    apolloMock = {
      query: jest.fn().mockReturnValue({
        toPromise: apolloQueryFnMock,
      }),
      mutate: jest.fn().mockReturnValue({
        toPromise: apolloMutateFnMock,
      }),
      getClient: jest.fn().mockReturnValue({
        cache: jest.mock('apollo-cache'),
        resetStore: jest.fn(),
      }),
    } as any; // Damn you Typescript

    apolloMock.getClient().cache.reset = jest.fn();
    authService = new AuthenticationService(httpClient, apolloMock);
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should create localstorage token key on authentication sucess with rememberme enabled', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: expiredMockToken,
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    await authService.login('someusername', 'somepassword', true);
    expect(localStorage.getItem('token')).toBe(expiredMockToken);
  });

  it('should restorePassword return status ok', async () => {
    const mockedResponse: any = {
      status: 'ok',
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    await authService.restorePassword('username');
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  it('should return true if restore password email sent', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: expiredMockToken,
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    await authService.restorePassword('username');
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  // it('should return true if restore password email sent',  () => {
  //   // const mockedResponse: LoginResponse = {
  //   //   accessToken: expiredMockToken,
  //   // };
  //   // toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
  //   // const response = await authService.restorePassword('1', '2', '3');
  //   // expect(response).toThrow();
  //   // const mockedResponse = {
  //   //   status: 500,
  //   // };
  //   // (httpClient.post as jest.Mock).mockImplementation(() => {
  //   //   throw mockedResponse;
  //   // });
  //   return expect(authService.restorePassword('someusername', 'somepassword', '1')).rejects.toBeFalsy();
  // });

  it('should not create localstorage token key on authentication sucess with rememberme disabled', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: expiredMockToken,
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    await authService.login('someusername', 'somepassword', false);
    expect(localStorage.getItem('token')).toBeNull();
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

  it('should return true if resetPassword authentication endpoint returned status code 200', async () => {
    const mockedResponse: any = {
      status: 'ok',
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));

    const resetPasswordResponse = await authService.resetPassword('someusername@gmail.com');

    expect(resetPasswordResponse).toBe(true);
  });

  it('should return false if resetPassword authentication endpoint returned status code 401', async () => {
    const mockedResponse = {
      status: 401,
    };

    (httpClient.post as jest.Mock).mockImplementation(() => {
      throw mockedResponse;
    });

    const resetPasswordResponse = await authService.resetPassword('someusername@gmail.com');

    expect(resetPasswordResponse).toBe(false);
  });

  it('should throw an exception if resetpassword authentication endpoint returned status code 500', () => {
    const mockedResponse = {
      status: 500,
    };

    (httpClient.post as jest.Mock).mockImplementation(() => {
      throw mockedResponse;
    });

    return expect(authService.resetPassword('someusername@gmail.com')).rejects.toEqual({ status: 500 });
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

  // TODO: fix tests!!!
  // it('should remove token from localstorage logout  if rememberMe', () => {
  //   authService.logout();
  //   expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  // });

  // it('should remove token from sessionstorage logout if !rememberMe', () => {
  //   authService.logout();
  //   expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
  // });

  it('should remove apollo cache on logout', () => {
    authService.logout();
    expect(apolloMock.getClient().cache.reset).toHaveBeenCalled();
  });

  it('should push user profile to store if local token has been found', () => {
    // given
    localStorage.setItem('token', expiredMockToken);

    // when
    authService.checkRestoreAuthData();

    // then
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  it('should push user profile to store only once', async () => {
    localStorage.setItem('token', expiredMockToken);

    await authService.checkRestoreAuthData();
    expect(apolloMock.mutate).toHaveBeenCalled();
    (apolloMock.mutate as jest.Mock).mockClear();

    await authService.checkRestoreAuthData();
    expect(apolloMock.mutate).not.toHaveBeenCalled();
  });

  it('should return false on login if token wasnt found in store', async () => {
    expect(await authService.login('someusername', 'some password', false)).toBe(false);
  });

  it('should return true on isTokenExpired when token is expired', () => {
    expect(authService.isTokenExpired(expiredMockToken)).toBe(true);
  });

  it('should not push user profile if token not token found in storage', async () => {
    await authService.checkRestoreAuthData();
    expect(apolloMock.mutate).not.toHaveBeenCalled();
  });

  it('should clear token after logout', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: expiredMockToken,
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    await authService.login('someusername', 'somepassword', true);
    expect(localStorage.getItem('token')).toBe(expiredMockToken);
    await authService.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  describe('user uniqueness validation', () => {
    it('should return true if user is unique', (done) => {
      const mockedResponse = of({ isUnique: true });

      (httpClient.post as jest.Mock).mockImplementation(() => mockedResponse);

      authService.checkUsernameUnique('username', 'id').subscribe((isUnique) => {
        expect(isUnique).toBe(true);
        done();
      });
    });

    it('should return false if user is taken', (done) => {
      const mockedResponse = of({ isUnique: false });

      (httpClient.post as jest.Mock).mockImplementation(() => mockedResponse);

      authService.checkUsernameUnique('username', 'id').subscribe((isUnique) => {
        expect(isUnique).toBe(false);
        done();
      });
    });

    it('should return true on error', (done) => {
      const mockedResponse = { status: 500 };

      (httpClient.post as jest.Mock).mockImplementation(() => {
        throw mockedResponse;
      });

      authService.checkUsernameUnique('username', 'id').subscribe((isUnique) => {
        expect(isUnique).toBe(true);
        done();
      });
    });
  });
  describe('first login', () => {
    it('should create sessionStorage token key', async () => {
      const mockedResponse: LoginResponse = {
        accessToken: expiredMockToken,
      };
      toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
      await authService.firstLogin('somefirsttoken');
      expect(sessionStorage.getItem('token')).toBe(expiredMockToken);
    });
    it('should not create local Storage token key', async () => {
      const mockedResponse: LoginResponse = {
        accessToken: expiredMockToken,
      };
      toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
      await authService.firstLogin('somefirsttoken');
      expect(localStorage.getItem('token')).toBe(null);
    });

    it('should return user profile when valid token was received', async () => {
      const mockedResponse: LoginResponse = {
        accessToken: expiredMockToken,
      };
      toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
      const user = await authService.firstLogin('somefirsttoken');
      expect(user).toBeDefined();
    });
    it('should appollo mutate called when valid user profile was received', async () => {
      const mockedResponse: LoginResponse = {
        accessToken: expiredMockToken,
      };
      toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
      await authService.firstLogin('somefirsttoken');
      expect(apolloMock.mutate).toHaveBeenCalled();
    });

    it('should return null when null returned from server', async () => {
      toPromiseFn.mockResolvedValue(Promise.resolve(null));
      const result = await authService.firstLogin('somefirsttoken');
      expect(result).toBeNull();
    });
    it('should throw erron when different than 401 returned', async () => {
      const mockedResponse = {
        status: 400,
      };

      (httpClient.post as jest.Mock).mockImplementation(() => {
        throw mockedResponse;
      });
      try {
        await authService.firstLogin('somefirsttoken');
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toEqual(400);
      }
    });
    it('should return null when 401 returned', async () => {
      const mockedResponse = {
        status: 401,
      };

      (httpClient.post as jest.Mock).mockImplementation(() => {
        throw mockedResponse;
      });
      const result = await authService.firstLogin('somefirsttoken');
      expect(result).toBeNull();
    });
  });
});
