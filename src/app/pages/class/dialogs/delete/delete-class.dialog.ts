import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ScheduleService } from '../../../../services/schedule/schedule.service';

@Component({
  selector: 'app-delete-class.dialog',
  templateUrl: './delete-class.dialog.html',
  styleUrls: ['../../../../../assets/scss/msw-alert-dialog.scss'],
})
export class DeleteClassDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public scheduleService: ScheduleService,
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {}
}
