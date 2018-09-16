import { Component, OnInit } from '@angular/core';
import { RouteInfo } from './models/route-info.model';
import { Apollo } from 'apollo-angular';
import { GET_USER_PROFILE } from '../../apollo/state/queries/get-user-profile.query';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';
import { UserType } from '../../models/user.model';

export const ROUTES: RouteInfo[] = [
  { path: 'student', title: 'ניהול תלמידים', class: 'nb-student', roles: [UserType.PRINCIPLE, UserType.TEACHER] },
  { path: 'class', title: 'ניהול כיתות', class: 'nb-class', roles: [UserType.PRINCIPLE, UserType.TEACHER] },
  { path: 'lesson', title: 'ניהול שיעורים', class: 'nb-lesson', roles: [UserType.PRINCIPLE, UserType.TEACHER] },
  { path: 'map', title: 'ניהול מפה', class: 'nb-map', roles: [UserType.PRINCIPLE] },
  { path: 'user', title: 'ניהול משתמשים', class: 'nb-user', roles: [UserType.PRINCIPLE] },
];
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menuItems: any[];
  currentUser: string;
  selectedMenuItem: string;

  constructor(private apollo: Apollo) {}

  async ngOnInit() {
    await this.apollo
      .watchQuery<{ userProfile: UserProfileStateModel }>({
        query: GET_USER_PROFILE,
      })
      .valueChanges.subscribe(userProf => {
        this.currentUser = userProf.data.userProfile.username;
        const currentType = userProf.data.userProfile.role;
        this.menuItems = ROUTES.filter(menuItem => menuItem.roles.includes(UserType[currentType]));
        this.selectedMenuItem = this.menuItems.length > 0 ? this.menuItems[0].path : ' ';
      });
  }

  selectMenuItem(menuItem) {
    this.selectedMenuItem = menuItem.path;
  }

  getSelectedMenuItem() {
    const route = ROUTES.find(menuItem => menuItem.path === this.selectedMenuItem);
    if (route) {
      return route.title;
    }
  }
}
