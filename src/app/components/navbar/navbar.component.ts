import { Component, OnInit } from '@angular/core';
import { RouteInfo } from './models/route-info.model';
import { Apollo } from 'apollo-angular';
import { GET_USER_PROFILE } from '../../apollo/state/queries/get-user-profile.query';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';
import { UserType } from '../../models/user.model';
import { Router, NavigationEnd } from '@angular/router';
import { pluck, filter, first, map } from 'rxjs/operators';

export const ROUTES: RouteInfo[] = [
  { path: 'student', title: 'ניהול תלמידים', class: 'nb-student', roles: [UserType.PRINCIPLE, UserType.TEACHER] },
  { path: 'class', title: 'ניהול כיתות', class: 'nb-class', roles: [UserType.PRINCIPLE] },
  { path: 'lesson', title: 'ניהול שיעורים', class: 'nb-lesson', roles: [UserType.PRINCIPLE] },
  { path: 'class/:id', title: 'ניהול מערכת שעות כיתתית', class: 'nb-lesson', roles: [UserType.TEACHER] },
  { path: 'map', title: 'ניהול מפה', class: 'nb-map', roles: [UserType.PRINCIPLE] },
  { path: 'user', title: 'ניהול משתמשים', class: 'nb-user', roles: [UserType.PRINCIPLE] },
];

export const DEFAULT_ROUTE = ROUTES[0];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menuItems: any[];
  currentUser: string;
  selectedMenuItemPath: string;

  constructor(private apollo: Apollo, private router: Router) {
    this.initMenuTitleFromRouter();
  }

  async ngOnInit() {
    await this.apollo
      .watchQuery<{ userProfile: UserProfileStateModel }>({
        query: GET_USER_PROFILE,
      })
      .valueChanges.subscribe((userProf) => {
        this.currentUser = userProf.data.userProfile.username;
        const currentType = userProf.data.userProfile.role;
        const currentClassId = userProf.data.userProfile.class_id;
        this.menuItems = ROUTES.filter((menuItem) => menuItem.roles.includes(UserType[currentType]));
        this.menuItems.map((item) => {
          if (item.path.indexOf('/:id') >= 0) {
            item.path = item.path.replace('/:id', currentClassId ? '/' + currentClassId : '');
          }
          return item;
        });
      });
  }

  selectMenuItem(menuItem) {
    this.selectedMenuItemPath = menuItem.path;
  }

  getSelectedMenuItem() {
    const route = ROUTES.find((menuItem) => menuItem.path === this.selectedMenuItemPath) || DEFAULT_ROUTE;
    return route.title;
  }

  private async initMenuTitleFromRouter() {
    this.selectedMenuItemPath = await this.router.events
      .pipe(
        filter((ev) => ev instanceof NavigationEnd),
        pluck('url'),
        first(),
        map(this.removeLeadingSlash),
      )
      .toPromise();
  }

  private removeLeadingSlash(s = '') {
    return s.replace(/^\/+/g, '');
  }
}
