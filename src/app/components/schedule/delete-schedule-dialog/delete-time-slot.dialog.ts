import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {ScheduleDialogData} from "../schedule-dialog/schedule-dialog-data.model";

@Component({
  selector: 'app-delete-time-slot.dialog',
  templateUrl: './delete-time-slot.dialog.html',
  styleUrls: ['./delete-time-slot.dialog.scss'],
})
export class DeleteTimeSlotDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteTimeSlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public scheduleDialogData: ScheduleDialogData,
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {}
}
