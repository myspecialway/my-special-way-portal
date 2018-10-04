import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionCleaner } from '../../../../../decorators/SubscriptionCleaner.decorator';

@Component({
  selector: 'app-student-details-notifications',
  templateUrl: './student-details-notifications.component.html',
  styleUrls: ['./student-details-notifications.component.scss'],
})
export class StudentDetailsNotificationsComponent implements OnInit {
  idOrNew: string;

  @SubscriptionCleaner()
  subCollector;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.route && this.route.parent) {
      this.subCollector.add(
        this.route.parent.params.subscribe((params: { idOrNew: string }) => {
          this.idOrNew = params.idOrNew;
        }),
      );
    }
  }
}
