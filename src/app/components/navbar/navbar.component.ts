import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteInfo } from './models/route-info.model';
import { Apollo } from 'apollo-angular';
import { GET_USER_PROFILE } from '../../apollo/state/queries/get-user-profile.query';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';
import { UserType } from '../../models/user.model';
import { Router, NavigationEnd } from '@angular/router';
import { pluck, filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export const ROUTES: RouteInfo[] = [
  { path: 'student', title: 'ROUTES.STUDENT', class: 'nb-student', roles: [UserType.PRINCIPLE, UserType.TEACHER] },
  { path: 'class', title: 'ROUTES.CLASSES', class: 'nb-class', roles: [UserType.PRINCIPLE] },
  { path: 'lesson', title: 'ROUTES.LESSON', class: 'nb-lesson', roles: [UserType.PRINCIPLE] },
  { path: 'class/:id', title: 'ROUTES.CLASS', class: 'nb-class-schedule', roles: [UserType.TEACHER] },
  { path: 'map', title: 'ROUTES.MAP', class: 'nb-map', roles: [UserType.PRINCIPLE] },
  { path: 'user', title: 'ROUTES.USER', class: 'nb-user', roles: [UserType.PRINCIPLE] },
];

export const DEFAULT_ROUTE = ROUTES[0];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuItems: any[];
  currentUser: string;
  selectedMenuItemPath: string;
  routeSubscription: Subscription;

  constructor(private apollo: Apollo, private router: Router, public translate: TranslateService) {
    this.subscribeToRouterEvents();

    ROUTES.forEach((route) => {
      this.translate.get(route.title).subscribe((resource) => {
        route.title = resource;
      });
    });
  }

  async ngOnInit() {
    this.apollo
      .watchQuery<{ userProfile: UserProfileStateModel }>({
        query: GET_USER_PROFILE,
      })
      .valueChanges.subscribe((userProf) => {
        this.currentUser = `${userProf.data.userProfile.firstname} ${userProf.data.userProfile.lastname}`;
        const currentType = userProf.data.userProfile.role;
        const currentClassId = userProf.data.userProfile.class_id;
        this.menuItems = ROUTES.filter((menuItem) => menuItem.roles.includes(UserType[currentType]));
        this.menuItems.forEach((item) => {
          if (item.path.indexOf('/:id') >= 0) {
            item.path = item.path.replace('/:id', currentClassId ? '/' + currentClassId : '');
          }
          return item;
        });
      });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  selectMenuItem(menuItem) {
    this.selectedMenuItemPath = menuItem.path;
  }

  getSelectedMenuItem() {
    const route = ROUTES.find((menuItem) => menuItem.path === this.selectedMenuItemPath) || DEFAULT_ROUTE;
    return route.title;
  }

  private subscribeToRouterEvents() {
    this.routeSubscription = this.router.events
      .pipe(
        filter((ev) => ev instanceof NavigationEnd),
        pluck('url'),
        map(this.removeLeadingSlash),
      )
      .subscribe((path) => (this.selectedMenuItemPath = path));
  }

  private removeLeadingSlash(s = '') {
    return s.replace(/^\/+/g, '');
  }
}
