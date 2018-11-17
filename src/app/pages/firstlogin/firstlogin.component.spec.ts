import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstloginComponent } from './firstlogin.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../user/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

describe('FirstloginComponent', () => {
  let component: FirstloginComponent;
  let fixture: ComponentFixture<FirstloginComponent>;

  let userServiceMock: Partial<UserService>;
  let routeMock: Partial<ActivatedRoute>;
  let authenticationServiceMock: Partial<AuthenticationService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirstloginComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    userServiceMock = {};
    routeMock = {};
    authenticationServiceMock = {};

    fixture = TestBed.createComponent(FirstloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
