import { async, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ResetPasswordComponent', () => {
  let authenticationServiceMock: Partial<AuthenticationService>;
  let routerModuleMock: Partial<RouterModule>;

  beforeEach(async(() => {
    authenticationServiceMock = {
      logout: jest.fn(),
      resetPassword: jest.fn(),
    };

    routerModuleMock = {
      forRoot: jest.fn(),
      forChild: jest.fn(),
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ResetPasswordComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                returnUrl: 'blabla',
              },
            },
          },
        },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: Router, useValue: routerModuleMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  it('should render the component as described in snapshot', () => {
    const fixture = TestBed.createComponent(ResetPasswordComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should call resetPassword function on resetPassword', async () => {
    const fixture = TestBed.createComponent(ResetPasswordComponent);
    fixture.componentInstance.resetPassword();
    expect(authenticationServiceMock.resetPassword).toHaveBeenCalled();
  });

  it('should call logout function on init', async () => {
    const fixture = TestBed.createComponent(ResetPasswordComponent);
    fixture.componentInstance.ngOnInit();
    expect(authenticationServiceMock.logout).toHaveBeenCalled();
  });
});
