import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
})

export class StudentDetailsComponent implements OnInit, OnDestroy {
  idOrNew: string;
  sub: Subscription;
  links: any;
  activeLink: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.links = [
      {label: 'פרטים אישיים', path: './personalInfo'},
      {label: 'מערכת שעות', path: './hours'},
      {label: 'תזכורות', path: './notifications'},
    ];
    this.activeLink = this.links[0].label;
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.idOrNew = params.idOrNew;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
