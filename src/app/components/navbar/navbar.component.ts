import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  currentUser: string;

  constructor(
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authService.getUsername().subscribe((user) => this.currentUser = user);
  }
 }
