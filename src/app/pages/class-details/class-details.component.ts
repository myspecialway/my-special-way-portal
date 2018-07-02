import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.scss'],
})
export class ClassDetailsComponent implements OnInit {

  days = ['שעה', 'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
  dataSource = [];
  constructor() {
    console.log('class-detail');
  }

  ngOnInit() {
  }

}
