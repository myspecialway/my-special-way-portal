import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionCleaner } from '../../../../../decorators/SubscriptionCleaner.decorator';
import { UpdateUserDialogComponent } from '../../../../user/dialogs/update/update-user.dialog';
import { UserService } from '../../../../user/services/user.service';
import { MatDialog } from '@angular/material';
import { UpdateStudentDialogComponent } from '../../../dialogs/update/update-student.dialog';
import { AddStudentDialogComponent } from '../../../dialogs/add/add-student.dialog';
import { AddStudentReminderDialogComponent } from '../../../dialogs/reminders/add/add-student-reminder.dialog';

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
  }
}
