import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionCleaner } from '../../../decorators/SubscriptionCleaner.decorator';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
})
export class StudentDetailsComponent implements OnInit {
  idOrNew: string;
  links: any;
  activeLink: string;

  @SubscriptionCleaner()
  subCollector;

  constructor(private route: ActivatedRoute) {
    this.links = [
      { label: 'פרטים אישיים', path: './personalInfo', dataTestId: 'personal-info-tab' },
      { label: 'מערכת שעות', path: './hours', dataTestId: 'schedule-tab' },
      { label: 'תזכורות', path: './notifications', dataTestId: 'reminders-tab' },
    ];
    this.activeLink = this.links[0].label;
  }

  ngOnInit(): void {
    this.subCollector.add(
      this.route.params.subscribe((params) => {
        this.idOrNew = params.idOrNew;
      }),
    );
  }
}
