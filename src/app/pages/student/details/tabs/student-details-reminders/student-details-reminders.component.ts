import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionCleaner } from '../../../../../decorators/SubscriptionCleaner.decorator';
import { MatDialog } from '@angular/material';
import { AddStudentReminderDialogComponent } from '../../../dialogs/reminders/add/add-student-reminder.dialog';

@Component({
  selector: 'app-student-details-reminders',
  templateUrl: './student-details-reminders.component.html',
  styleUrls: ['./student-details-reminders.component.scss'],
})
export class StudentDetailsRemindersComponent implements OnInit {
  idOrNew: string;

  rehabToggleMode = false;
  medicineToggleMode = false;

  @SubscriptionCleaner()
  subCollector;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

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

  updateStudentReminder(type: string, event: any) {
    const dialogRef = this.dialog.open(AddStudentReminderDialogComponent, {
      data: 'userData',
      height: '376px',
      width: '631px',
    });

    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (data) => {}),
    );
  }
}
