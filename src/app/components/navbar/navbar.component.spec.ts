import { NavbarComponent } from './navbar.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Shallow } from 'shallow-render/dist';
import { ComponentsModule } from '../components.module';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';

describe('navbar component', () => {
  let shallow: Shallow<NavbarComponent>;
  let watchQueryObservable: Subject<any>;
  beforeEach(async () => {
    watchQueryObservable = new Subject();
    const apolloMock = {
      watchQuery: () => ({
        valueChanges: watchQueryObservable,
      }),
    };
    shallow = new Shallow(NavbarComponent, ComponentsModule);
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [{ provide: Apollo, useValue: apolloMock }, HttpClient, HttpHandler, AuthenticationService],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    });
    // const apollo = TestBed.get(HttpClient);
  });
  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should render username per authentication service on init - for principle', async () => {
    // given
    const component = await shallow.render('<app-navbar></app-navbar>');

    // when
    watchQueryObservable.next({
      data: {
        userProfile: {
          username: 'test',
          role: 'PRINCIPLE',
          class_id: 'some_classid',
        },
      },
    });

    // then
    component.fixture.detectChanges();
    const liElement = component.element.nativeElement.querySelector('.msw-header-user-name') as HTMLLIElement;
    expect(liElement.innerHTML).toBe('test');
  });

  it('should update the selected menu item on selection', async () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.componentInstance.selectMenuItem({ path: 'class', title: 'ניהול כיתות', class: 'nb-class' });
    expect(fixture.componentInstance.selectedMenuItem).toEqual('class');
  });

  it('should return the correct menu item', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.componentInstance.selectMenuItem({ path: 'class', title: 'ניהול כיתות', class: 'nb-class' });
    const title = fixture.componentInstance.getSelectedMenuItem();
    expect(title).toEqual('ניהול כיתות');
  });

  it('should render username per authentication service on init - for teacher', async () => {
    // given
    const component = await shallow.render('<app-navbar></app-navbar>');

    // when
    watchQueryObservable.next({
      data: {
        userProfile: {
          username: 'test',
          role: 'TEACHER',
          class_id: 'some_classid',
        },
      },
    });

    // then
    component.fixture.detectChanges();
    const liElement = component.element.nativeElement.querySelector('.msw-header-user-name') as HTMLLIElement;
    expect(liElement.innerHTML).toBe('test');
  });
});
