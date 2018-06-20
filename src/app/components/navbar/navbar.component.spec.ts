import { NavbarComponent } from './navbar.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('navbar component', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        NavbarComponent,
      ],
      providers: [
        AuthenticationService,
        HttpClient,
        HttpHandler,
      ],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    expect(fixture).toMatchSnapshot();
  });
});
