import { NavbarComponent } from './navbar.component';
import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Injectable } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Shallow } from 'shallow-render/dist';
import { ComponentsModule } from '../components.module';
import { Apollo } from 'apollo-angular';
import { Subject, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material';

const fixUrl = (s) => s.replace(/^\/+/g, '');

@Injectable()
export class RouterStub {
  url: string;

  private subject = new Subject();
  events = this.subject.asObservable();

  navigate([url]: string[]) {
    this.url = url;
    this.triggerNavEvents(url);
  }

  triggerNavEvents(url) {
    const ne = new NavigationEnd(0, url, url);
    this.subject.next(ne);
  }
}

describe('navbar component', () => {
  let shallow: Shallow<NavbarComponent>;
  let watchQueryObservable: Subject<any>;
  let router: RouterStub;
  let exitSystemDialogMock: Partial<MatDialog>;
  let lessonDialogMockValue: boolean;

  beforeEach(async () => {
    watchQueryObservable = new Subject();
    const apolloMock = {
      watchQuery: () => ({
        valueChanges: watchQueryObservable,
      }),
    };
    lessonDialogMockValue = true;
    exitSystemDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(() => Observable.of(lessonDialogMockValue)),
      }),
    };
    shallow = new Shallow(NavbarComponent, ComponentsModule);
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: Apollo, useValue: apolloMock },
        HttpClient,
        HttpHandler,
        AuthenticationService,
        { provide: Router, useClass: RouterStub },
        { provide: MatDialog, useValue: exitSystemDialogMock },
      ],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    });
    // const apollo = TestBed.get(HttpClient);
  });
  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should keep selected menu item path reflecting the route path', fakeAsync(() => {
    // given
    router = TestBed.get(Router);
    const fixture = TestBed.createComponent(NavbarComponent);
    expect(fixture.componentInstance.selectedMenuItemPath).toBeUndefined();

    // router.initialNavigation();
    const givenRoutePath = '/test-path';
    const expectedMenuItemPath = fixUrl(givenRoutePath);
    // when
    router.navigate([givenRoutePath]);
    tick();

    // then
    expect(fixture.componentInstance.selectedMenuItemPath).toBe(expectedMenuItemPath);
  }));

  it('should render username per authentication service on init - for principle', async () => {
    // given
    const component = await shallow.render('<app-navbar></app-navbar>');

    // when
    watchQueryObservable.next({
      data: {
        userProfile: {
          username: 'test',
          firstname: 'MSW',
          lastname: 'PRINCIPLE',
          role: 'PRINCIPLE',
          class_id: 'some_classid',
        },
      },
    });

    // then
    component.fixture.detectChanges();
    const liElement = component.element.nativeElement.querySelector('.msw-header-user-name') as HTMLLIElement;
    expect(liElement.innerHTML).toBe('MSW PRINCIPLE');
  });

  it('should update the selected menu item on selection', async () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.componentInstance.selectMenuItem({ path: 'class', title: 'ניהול כיתות', class: 'nb-class' });
    expect(fixture.componentInstance.selectedMenuItemPath).toEqual('class');
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
          firstname: 'MSW',
          lastname: 'TEACHER',
          role: 'TEACHER',
          class_id: 'some_classid',
        },
      },
    });

    // then
    component.fixture.detectChanges();
    const liElement = component.element.nativeElement.querySelector('.msw-header-user-name') as HTMLLIElement;
    expect(liElement.innerHTML).toBe('MSW TEACHER');
  });
});
