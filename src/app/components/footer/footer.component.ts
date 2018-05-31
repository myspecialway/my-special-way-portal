import { Component, OnInit, NgModule } from '@angular/core';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {
  test: Date;

  constructor() { }

  ngOnInit() {
    this.test = new Date();
   }
}
