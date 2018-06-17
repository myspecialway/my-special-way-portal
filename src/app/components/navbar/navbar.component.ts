import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RouteInfo } from '../sidebar/sidebar.component';

export const ROUTES: RouteInfo[] = [
  { path: 'student', title: 'ניהול תלמידים', class: '' },
  { path: 'class', title: 'ניהול כיתות', class: '' },
  { path: 'user', title: 'ניהול משתמשים', class: '' },
];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent  implements OnInit {
  menuItems: any[];
  currentUser: string;

  constructor(
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authService.getUsername().subscribe((user) => this.currentUser = user);
  }
 }
