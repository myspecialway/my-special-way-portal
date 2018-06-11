import {Component, OnInit} from '@angular/core';
export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: 'student', title: 'ניהול תלמידים', icon: 'school', class: '' },
  { path: 'class', title: 'ניהול כיתות', icon: 'class', class: '' },
  { path: 'user', title: 'ניהול משתמשים', icon: 'class', class: '' },
];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent  implements OnInit{
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
}
