import { Component, OnInit } from '@angular/core';

export interface RouteInfo {
  path: string;
  title: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: 'student', title: 'ניהול תלמידים',  class: '' },
  { path: 'class', title: 'ניהול כיתות',  class: '' },
  { path: 'user', title: 'ניהול משתמשים',  class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
}
