import { NavbarComponent } from './navbar.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Shallow } from 'shallow-render/dist';
import { ComponentsModule } from '../components.module';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('navbar component', () => {
  let shallow: Shallow<NavbarComponent>;
  beforeEach(async () => {
    class AuthenticationServiceMock {
        getUsername = jest.fn().mockImplementation(() => {
        return new BehaviorSubject('תמר');
      });
    }
    shallow = new Shallow(NavbarComponent, ComponentsModule);
    TestBed.configureTestingModule({
      declarations: [
        NavbarComponent,
      ],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
      ],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should render username per authentication service on init', async () => {
    const component = await shallow.render('<app-navbar></app-navbar>');
    const liElements = component.find('.msw-header-user-name');
    expect(liElements.nativeElement.innerHTML).toBe('תמר');
  });
});
