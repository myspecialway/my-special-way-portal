import { AuthGuard } from '../auth.guard';
import { Router } from '@angular/router';

describe('auth guard', () => {
  let routerMock: Partial<Router>;
  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };
  });

  it('should return true if token has been found', () => {
    const guard = new AuthGuard(routerMock as Router);
    (localStorage.getItem as jest.Mock).mockReturnValueOnce('some token');

    const response = guard.canActivate(null, null);
    expect(response).toBe(true);
  });

  it('should navigate to login page if token not found and return false', () => {
    const guard = new AuthGuard(routerMock as Router);
    (localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

    const response = guard.canActivate(null, { url: 'someurl', root: null });

    expect(response).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalled();
  });
});
