import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-details-hours',
  templateUrl: './student-details-hours.component.html',
  styleUrls: ['./student-details-hours.component.scss'],
})
export class StudentDetailsHoursComponent implements OnInit {

  sub: any;
  idOrNew: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (this.route && this.route.parent) {
      this.sub = this.route.parent.params.subscribe((params) => {
        this.idOrNew = params.idOrNew;
      });
    }
  }
}
