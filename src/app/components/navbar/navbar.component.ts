import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RouteInfo } from './models/route-info.model';
import { Apollo } from 'apollo-angular';
import { GET_USER_PROFILE } from '../../apollo/state/queries/get-user-profile.query';

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
    private authService: AuthenticationService,
    private apollo: Apollo,
  ) { }

  async ngOnInit() {
    // const res = await this.apollo.query<any>({
    //   query: GET_USER_PROFILE,
    // }).subscribe((result) => {
    //   this.currentUser = result.data.username;
    // });

    // this.authService.getUsername().subscribe((user) => this.currentUser = user);
    this.menuItems = ROUTES.filter((menuItem) => menuItem); // TODO: filter by role
  }
}
