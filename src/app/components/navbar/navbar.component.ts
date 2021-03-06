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
import { AuthenticationService } from '../../services/authentication/authentication.service';

export const ROUTES: RouteInfo[] = [
  { path: 'student', title: 'ניהול תלמידים', class: 'nb-student', roles: [UserType.PRINCIPLE, UserType.TEACHER] },
  { path: 'class', title: 'ניהול כיתות', class: 'nb-class', roles: [UserType.PRINCIPLE] },
  { path: 'lesson', title: 'ניהול שיעורים', class: 'nb-lesson', roles: [UserType.PRINCIPLE] },
  { path: 'class/:id', title: 'ניהול מערכת שעות כיתתית', class: 'nb-class-schedule', roles: [UserType.TEACHER] },
  { path: 'maps', title: 'ניהול מפות', class: 'nb-manage-maps', roles: [UserType.PRINCIPLE] },
  {
    path: 'non-active-times',
    title: 'ניהול זמני אי פעילות',
    class: 'nb-non-active-times',
    roles: [UserType.PRINCIPLE],
  },
  { path: 'user', title: 'ניהול משתמשים', class: 'nb-user', roles: [UserType.PRINCIPLE] },
  { path: 'settings', title: 'הגדרות', class: 'nb-user', roles: [UserType.PRINCIPLE] },
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

  constructor(
    private apollo: Apollo,
    private router: Router,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) {
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
    let route = DEFAULT_ROUTE;
    if (this.selectedMenuItemPath) {
      route = ROUTES.find((menuItem) => this.selectedMenuItemPath.includes(menuItem.path)) || DEFAULT_ROUTE;
    }
    return route.title;
  }

  public async exitSystem() {
    const dialogRef = this.dialog.open(ExitSystemDialogComponent, {
      height: '250px',
      width: '360px',
    });
    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (result) => {
          if (result === true) {
            this.router.navigate(['/login']);
            await this.authenticationService.logout();
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

  private removeLeadingSlash(domainString = '') {
    return domainString.replace(/^\/+/g, '');
  }
}
