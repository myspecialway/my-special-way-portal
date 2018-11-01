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

  rehabToggleMode: boolean = false;
  medicineToggleMode: boolean = false;

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

  onToggleChanged(toggleType: string, event) {
    console.log(event);
    if (toggleType === 'rehab') {
      this.rehabToggleMode = !this.rehabToggleMode;
    }
    if (toggleType === 'medicine') {
      this.medicineToggleMode = !this.medicineToggleMode;
    }
  }
}
