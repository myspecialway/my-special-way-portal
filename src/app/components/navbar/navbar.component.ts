import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteInfo } from './models/route-info.model';
import { Apollo } from 'apollo-angular';
import { GET_USER_PROFILE } from '../../apollo/state/queries/get-user-profile.query';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';
import { UserType } from '../../models/user.model';
import { Router, NavigationEnd } from '@angular/router';
import { pluck, filter, map, first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ExitSystemDialogComponent } from './dialogs/exit/exit-system.dialog';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';

export const ROUTES: RouteInfo[] = [
  { path: 'student', title: 'ניהול תלמידים', class: 'nb-student', roles: [UserType.PRINCIPLE, UserType.TEACHER] },
  { path: 'class', title: 'ניהול כיתות', class: 'nb-class', roles: [UserType.PRINCIPLE] },
  { path: 'lesson', title: 'ניהול שיעורים', class: 'nb-lesson', roles: [UserType.PRINCIPLE] },
  { path: 'class/:id', title: 'ניהול מערכת שעות כיתתית', class: 'nb-class-schedule', roles: [UserType.TEACHER] },
  { path: 'map', title: 'ניהול מפה', class: 'nb-map', roles: [UserType.PRINCIPLE] },
  { path: 'user', title: 'ניהול משתמשים', class: 'nb-user', roles: [UserType.PRINCIPLE] },
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

  @SubscriptionCleaner()
  subCollector;

  constructor(private apollo: Apollo, private router: Router, public dialog: MatDialog) {
    this.subscribeToRouterEvents();
  }

  async ngOnInit() {
    await this.apollo
      .watchQuery<{ userProfile: UserProfileStateModel }>({
        query: GET_USER_PROFILE,
      })
      .valueChanges.subscribe((userProf) => {
        this.currentUser = `${userProf.data.userProfile.firstname} ${userProf.data.userProfile.lastname}`;
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

  exitSystem() {
    const dialogRef = this.dialog.open(ExitSystemDialogComponent, {
      height: '275px',
      width: '360px',
    });
    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.router.navigate(['/login']);
          }
        }),
    );
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
