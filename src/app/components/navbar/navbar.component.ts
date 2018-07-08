import { Component, OnInit } from '@angular/core';
import { RouteInfo } from './models/route-info.model';
import { Apollo } from 'apollo-angular';
import { GET_USER_PROFILE } from '../../apollo/state/queries/get-user-profile.query';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';

export const ROUTES: RouteInfo[] = [
  { path: 'student', title: 'ניהול תלמידים', class: 'nb-student' },
  { path: 'class', title: 'ניהול כיתות', class: 'nb-class' },
  { path: 'lesson', title: 'ניהול שיעורים', class: 'nb-lesson' },
  { path: 'map', title: 'ניהול מפה', class: 'nb-map' },
  { path: 'user', title: 'ניהול משתמשים', class: 'nb-user' },

];
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit {
  menuItems: any[];
  currentUser: string;

  constructor(
    private apollo: Apollo,
  ) { }

  async ngOnInit() {
    await this.apollo.watchQuery<{ userProfile: UserProfileStateModel }>({
      query: GET_USER_PROFILE,
    }).valueChanges.subscribe((userProf) => {
      this.currentUser = userProf.data.userProfile.username;
    });
    this.menuItems = ROUTES.filter((menuItem) => menuItem); // TODO: filter by role
  }
}
