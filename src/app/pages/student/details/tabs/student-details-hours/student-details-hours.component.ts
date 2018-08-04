import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-details-hours',
  templateUrl: './student-details-hours.component.html',
  styleUrls: ['./student-details-hours.component.scss'],
})
export class StudentDetailsHoursComponent {

  sub: any;
  idOrNew: string;

  constructor(
    private route: ActivatedRoute,
  ) { }
}
