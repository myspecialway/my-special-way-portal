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
      { label: 'פרטים אישיים', path: './personalInfo', dataTestId: 'personal-info-tab', enabled: true },
      { label: 'מערכת שעות', path: './hours', dataTestId: 'schedule-tab', enabled: true },
      { label: 'תזכורות', path: './reminders', dataTestId: 'reminders-tab', enabled: true },
    ];
    this.activeLink = this.links[0].label;
  }

  setEnabledLinks() {
    if (this.idOrNew === '_new_') {
      this.links[1].enabled = false;
      this.links[2].enabled = false;
    } else {
      this.links[1].enabled = true;
      this.links[2].enabled = true;
    }
  }

  ngOnInit(): void {
    this.subCollector.add(
      this.route.params.subscribe((params) => {
        this.idOrNew = params.idOrNew;
        this.setEnabledLinks();
      }),
    );
  }
}
