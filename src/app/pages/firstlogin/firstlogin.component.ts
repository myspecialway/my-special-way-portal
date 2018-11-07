import { Component, OnInit } from '@angular/core';
import { FirstloginService } from './services/firstlogin.service';

@Component({
  selector: 'app-firstlogin',
  templateUrl: './firstlogin.component.html',
  styleUrls: ['./firstlogin.component.scss'],
})
export class FirstloginComponent implements OnInit {
  constructor(private firstLoginService: FirstloginService) {}

  ngOnInit() {}

  updateUserPassword(userId: number, password: string) {
    this.firstLoginService.updateUserPassword(userId, password);
  }
}
