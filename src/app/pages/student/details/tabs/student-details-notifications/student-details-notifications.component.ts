import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-details-notifications',
  templateUrl: './student-details-notifications.component.html',
  styleUrls: ['./student-details-notifications.component.scss'],
})
export class StudentDetailsNotificationsComponent implements OnInit {

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
